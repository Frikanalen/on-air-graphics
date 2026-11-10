import { clamp, lerp, rgb } from "./color"
import { type sceneAt } from "./scene"
import { sceneImages } from "./useSceneAssets"

type Scene = ReturnType<typeof sceneAt>
const sigmas = [0, 12, 44, 108]
const vertex = `
attribute vec2 position; attribute vec2 uv;
varying vec2 point; varying vec2 texcoord;
void main(){point=position;texcoord=uv;gl_Position=vec4(position.x/640.0-1.0,1.0-position.y/360.0,0.0,1.0);}`
const fragment = `
precision highp float;
varying vec2 point; varying vec2 texcoord;
uniform sampler2D image; uniform int mode;
uniform vec3 color,stop0,stop1,stop2;
uniform vec2 center; uniform float radius,opacity;
void main(){
 if(mode==0){float d=length((point-center)/(vec2(1280.0,720.0)*radius));
 vec3 c=d<0.5?mix(stop0,stop1,clamp(d*2.0,0.0,1.0)):mix(stop1,stop2,clamp((d-0.5)*2.0,0.0,1.0));gl_FragColor=vec4(c,1.0);}
 else if(mode==3){float a=texture2D(image,fract(point/vec2(256.0,144.0))).a;gl_FragColor=vec4(1.0,1.0,1.0,a*opacity);}
 else {vec4 c=texture2D(image,texcoord);gl_FragColor=vec4(mode==1?color:c.rgb,c.a*opacity);}
}`

/** One scene canvas on a real GPU; known software renderers use the DOM path.
 * Blur is entirely texture interpolation. No live convolution or readback. */
export function createWebGLScene(canvas: HTMLCanvasElement, force = false) {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    preserveDrawingBuffer: true,
    antialias: true,
    powerPreference: "high-performance",
  })
  if (!gl) return null
  const debug = gl.getExtension("WEBGL_debug_renderer_info")
  const renderer = String(
    gl.getParameter(debug ? debug.UNMASKED_RENDERER_WEBGL : gl.RENDERER),
  )
  if (!force && /swiftshader|llvmpipe|softpipe|software/i.test(renderer)) {
    return null
  }
  const program = gl.createProgram()!
  const shaders = [vertex, fragment].map((source, i) => {
    const shader = gl.createShader(i ? gl.FRAGMENT_SHADER : gl.VERTEX_SHADER)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(shader) ?? "Scene shader failed")
    gl.attachShader(program, shader)
    return shader
  })
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    throw new Error(gl.getProgramInfoLog(program) ?? "Scene link failed")
  gl.useProgram(program)
  const buffer = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  for (const [name, offset] of [
    ["position", 0],
    ["uv", 8],
  ] as const) {
    const attribute = gl.getAttribLocation(program, name)
    gl.enableVertexAttribArray(attribute)
    gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 16, offset)
  }
  const uniform = (name: string) => gl.getUniformLocation(program, name)
  const u = Object.fromEntries(
    [
      "mode",
      "color",
      "stop0",
      "stop1",
      "stop2",
      "center",
      "radius",
      "opacity",
    ].map((name) => [name, uniform(name)]),
  )
  gl.uniform1i(uniform("image"), 0)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  const textures = new Map<string, WebGLTexture>()
  for (const [name, image] of sceneImages) {
    const texture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    const format =
      name.endsWith(".png") && name !== "grain.png" ? gl.ALPHA : gl.RGBA
    gl.texImage2D(gl.TEXTURE_2D, 0, format, format, gl.UNSIGNED_BYTE, image)
    textures.set(name, texture)
  }
  const scale = Math.max(1, Math.min(2, window.innerWidth / 1280))
  canvas.width = 1280 * scale
  canvas.height = 720 * scale
  gl.viewport(0, 0, canvas.width, canvas.height)
  const full = [
    [0, 0],
    [1280, 0],
    [1280, 720],
    [0, 720],
  ]
  function quad(
    points: number[][],
    mode: number,
    opacity: number,
    texture?: string,
    color = "#ffffff",
  ) {
    if (opacity <= 0) return
    const uv = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ]
    const data = new Float32Array(
      [0, 1, 2, 0, 2, 3].flatMap((i) => [...points[i], ...uv[i]]),
    )
    gl!.bufferData(gl!.ARRAY_BUFFER, data, gl!.DYNAMIC_DRAW)
    gl!.uniform1i(u.mode, mode)
    gl!.uniform1f(u.opacity, opacity)
    gl!.uniform3fv(u.color, rgb(color))
    if (texture) gl!.bindTexture(gl!.TEXTURE_2D, textures.get(texture)!)
    gl!.drawArrays(gl!.TRIANGLES, 0, 6)
  }
  function draw(scene: Scene, timestamp: number) {
    const { light, bladeLight } = scene
    gl!.uniform3fv(u.stop0, rgb(light.stops[0]))
    gl!.uniform3fv(u.stop1, rgb(light.stops[1]))
    gl!.uniform3fv(u.stop2, rgb(light.stops[2]))
    gl!.uniform2f(u.center, light.x * 12.8, light.y * 7.2)
    gl!.uniform1f(u.radius, lerp(0.95, 1.1, scene.sheet))
    quad(full, 0, 1)
    for (const layer of ["soft", "wide", "tight"]) {
      const soft = layer === "soft",
        wide = layer === "wide"
      const scale = soft ? (scene.scale * 13.9) / 13.4 : scene.scale
      const opacity = soft
        ? scene.softShadow
        : wide
          ? scene.wide * bladeLight.opacity * 0.5
          : scene.fill * bladeLight.opacity
      const blur = soft
        ? (50 * scene.scale) / 13.4
        : wide
          ? bladeLight.wide
          : scene.blur
      const wanted = (blur * 30) / scale
      const hi = clamp(
          sigmas.findIndex((s) => s >= wanted),
          1,
          3,
        ),
        lo = hi - 1
      const mix = clamp((wanted - sigmas[lo]) / (sigmas[hi] - sigmas[lo]))
      for (let i = 0; i < 3; i++) {
        const angle =
          (1.5 *
            Math.sin(
              (timestamp / 90000) * 2 * Math.PI + (i * 2 * Math.PI) / 3,
            ) *
            Math.PI) /
          180
        const points = [
          [-5, -5],
          [50, -5],
          [50, 57],
          [-5, 57],
        ].map(([x, y]) => {
          const rx =
            26 + (x - 26) * Math.cos(angle) - (y - 26) * Math.sin(angle)
          const ry =
            26 + (x - 26) * Math.sin(angle) + (y - 26) * Math.cos(angle)
          const yy =
            (soft ? scene.ty + (48 * scene.scale) / 13.4 : scene.ty) +
            ry * scale
          const xx =
            (soft ? scene.tx + (32 * scene.scale) / 13.4 : scene.tx) +
            rx * scale
          return [
            xx + (soft ? 0 : Math.tan((scene.skew * Math.PI) / 180) * yy),
            yy,
          ]
        })
        const high = mix * opacity
        quad(
          points,
          1,
          (opacity - high) / (1 - high || 1),
          `blade-${i}-${sigmas[lo]}.png`,
          soft ? "#2A1B2C" : bladeLight.shadow,
        )
        quad(
          points,
          1,
          high,
          `blade-${i}-${sigmas[hi]}.png`,
          soft ? "#2A1B2C" : bladeLight.shadow,
        )
        if (!soft && !wide)
          quad(points, 2, 1 - scene.fill, `blade-${i}-lit.svg`)
      }
    }
    quad(full, 3, scene.grain, "grain.png")
  }
  return {
    renderer,
    draw,
    dispose() {
      textures.forEach((texture) => gl.deleteTexture(texture))
      gl.deleteBuffer(buffer)
      shaders.forEach((shader) => gl.deleteShader(shader))
      gl.deleteProgram(program)
    },
  }
}
