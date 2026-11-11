import { useContext, useLayoutEffect, useRef } from "react"
import { PlayheadContext } from "../../sequencing/clock/PlayheadContext"
import { type Plan } from "../../sequencing/plan/types"
import { clamp, lerp } from "../../graphics/color"
import { sceneAt } from "../../graphics/scene"
import { useFrame } from "../../graphics/useFrame"
import { frameClock } from "../../graphics/time"
import { createWebGLScene } from "../../graphics/webgl"

const asset = (name: string) => `${import.meta.env.BASE_URL}scene/${name}`
const sigmas = [0, 12, 44, 108]

/** Static masks are rasterised once at 1080p, never filtered during playout.
 * Only the three blades drift; the noise texture is fixed in frame space. */
export function Background({
  plan,
  onReady,
}: {
  plan: Plan
  onReady: (ready: boolean) => void
}) {
  const playhead = useContext(PlayheadContext)
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const gpu = useRef<ReturnType<typeof createWebGLScene>>(null)
  const drawRef = useRef<(timestamp: number) => void>(() => {})
  useLayoutEffect(() => {
    const element = root.current!,
      surface = canvas.current!
    const dom = element.querySelector<HTMLElement>(".dom-scene")!
    const requested = new URLSearchParams(window.location.search).get(
      "renderer",
    )
    const fallback = () => {
      gpu.current = null
      surface.style.display = "none"
      dom.style.display = "block"
      element.dataset.renderer = "dom"
      console.info("Frikanalen scene: DOM fallback")
      drawRef.current(frameClock.now())
    }
    const initialize = () => {
      try {
        gpu.current =
          requested === "dom"
            ? null
            : createWebGLScene(surface, requested === "webgl")
        if (gpu.current) {
          dom.style.display = "none"
          surface.style.display = "block"
          element.dataset.renderer = "webgl"
          console.info(`Frikanalen scene: ${gpu.current.renderer}`)
        } else fallback()
      } catch (error) {
        console.warn(error)
        fallback()
      }
      drawRef.current(frameClock.now())
      onReady(true)
    }
    const lost = (event: Event) => {
      event.preventDefault()
      fallback()
    }
    initialize()
    surface.addEventListener("webglcontextlost", lost)
    surface.addEventListener("webglcontextrestored", initialize)
    return () => {
      surface.removeEventListener("webglcontextlost", lost)
      surface.removeEventListener("webglcontextrestored", initialize)
      gpu.current?.dispose()
      gpu.current = null
    }
  }, [onReady])
  const draw = (timestamp: number) => {
    const element = root.current
    if (!element) return
    const scene = sceneAt(plan, playhead.now(), timestamp)
    const wordmark =
      element.parentElement?.querySelector<HTMLElement>(".wide-wordmark")
    if (wordmark) {
      wordmark.style.left = `${scene.tx + 55.19 * scene.scale}px`
      wordmark.style.top = `${scene.ty}px`
      wordmark.style.width = `${184.66 * scene.scale}px`
      wordmark.style.height = `${52 * scene.scale}px`
      wordmark.style.opacity = String(1 - clamp((scene.scale - 3.25) / 5))
    }
    if (gpu.current) {
      gpu.current.draw(scene, timestamp)
      return
    }
    const { light, bladeLight } = scene
    const radius = lerp(95, 110, scene.sheet)
    element.style.backgroundImage = `radial-gradient(ellipse ${radius}% ${radius}% at ${light.x}% ${light.y}%, ${light.stops[0]} 0%, ${light.stops[1]} 50%, ${light.stops[2]} 100%)`
    element.querySelector<HTMLElement>(".scene-grain")!.style.opacity = String(
      scene.grain,
    )
    for (const group of element.querySelectorAll<HTMLElement>(".blade-pose")) {
      const soft = group.dataset.layer === "soft"
      const softScale = (scene.scale * 13.9) / 13.4
      const scale = soft ? softScale : scene.scale
      group.style.transform = soft
        ? `translate(${scene.tx + (32 * scene.scale) / 13.4}px,${scene.ty + (48 * scene.scale) / 13.4}px) scale(${softScale})`
        : `skewX(${scene.skew}deg) translate(${scene.tx}px,${scene.ty}px) scale(${scale})`
      const opacity = soft
        ? scene.softShadow
        : group.dataset.layer === "wide"
          ? scene.wide * bladeLight.opacity * 0.5
          : 1
      group.style.opacity = String(opacity)
      const blur = soft
        ? (50 * scene.scale) / 13.4
        : group.dataset.layer === "wide"
          ? bladeLight.wide
          : scene.blur
      const wanted = (blur * 30) / scale
      const upper = Math.max(
        1,
        sigmas.findIndex((s) => s >= wanted),
      )
      const lo = upper - 1,
        hi = upper
      const mix = clamp((wanted - sigmas[lo]) / (sigmas[hi] - sigmas[lo]))
      for (const blade of group.querySelectorAll<HTMLElement>(".blade")) {
        const i = Number(blade.dataset.blade)
        const drift =
          1.5 *
          Math.sin((timestamp / 90000) * 2 * Math.PI + (i * 2 * Math.PI) / 3)
        blade.style.transform = `rotate(${drift}deg)`
        for (const mask of blade.querySelectorAll<HTMLElement>(".blade-mask")) {
          const index = Number(mask.dataset.blur)
          // Alpha over alpha needs adjusted weights to sum to the requested opacity.
          const alpha =
            soft || group.dataset.layer === "wide"
              ? 1
              : scene.fill * bladeLight.opacity
          const high = mix * alpha
          mask.style.opacity = String(
            index === hi
              ? high
              : index === lo
                ? (alpha - high) / (1 - high || 1)
                : 0,
          )
          mask.style.backgroundColor = soft ? "#2A1B2C" : bladeLight.shadow
        }
        const lit = blade.querySelector<HTMLElement>(".blade-lit")
        if (lit) lit.style.opacity = String(1 - scene.fill)
      }
    }
  }
  drawRef.current = draw
  useFrame(draw, playhead)
  return (
    <div ref={root} className="scene" aria-hidden="true">
      <canvas ref={canvas} className="scene-canvas" />
      <div className="dom-scene">
        {(["soft", "wide", "tight"] as const).map((layer) => (
          <div key={layer} data-layer={layer} className="blade-pose">
            {[0, 1, 2].map((i) => (
              <div key={i} data-blade={i} className="blade">
                {sigmas.map((sigma, index) => (
                  <div
                    key={sigma}
                    data-blur={index}
                    className="blade-mask"
                    style={{
                      maskImage: `url(${asset(`blade-${i}-${sigma}.png`)})`,
                      WebkitMaskImage: `url(${asset(`blade-${i}-${sigma}.png`)})`,
                    }}
                  />
                ))}
                {layer === "tight" && (
                  <img
                    className="blade-lit"
                    src={asset(`blade-${i}-lit.svg`)}
                    alt=""
                  />
                )}
              </div>
            ))}
          </div>
        ))}
        <div
          className="scene-grain"
          style={{ backgroundImage: `url(${asset("grain.png")})` }}
        />
      </div>
    </div>
  )
}
