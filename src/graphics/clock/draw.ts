import { clockModel } from "./model"

const R = 128
const radians = (degrees: number) => (degrees * Math.PI) / 180
function hand(
  ctx: CanvasRenderingContext2D,
  angle: number,
  length: number,
  hubWidth: number,
  tipWidth: number,
  tail: number,
  color = "white",
) {
  ctx.save()
  ctx.rotate(radians(angle))
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo((-hubWidth * R) / 2, tail * R)
  ctx.lineTo((-hubWidth * R) / 2, 0)
  ctx.lineTo((-tipWidth * R) / 2, -length * R)
  ctx.lineTo((tipWidth * R) / 2, -length * R)
  ctx.lineTo((hubWidth * R) / 2, 0)
  ctx.lineTo((hubWidth * R) / 2, tail * R)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}
export function drawAnalog(ctx: CanvasRenderingContext2D, timestamp: number) {
  const model = clockModel(timestamp)
  ctx.save()
  ctx.translate(176, 158)
  for (let i = 0; i < 60; i++) {
    ctx.save()
    ctx.rotate((i * Math.PI) / 30)
    if (i === 0) {
      ctx.fillStyle = "white"
      const width = 0.052 * R,
        gap = 0.029 * R
      ctx.fillRect(-gap / 2 - width, -R, width, 0.17 * R)
      ctx.fillRect(gap / 2, -R, width, 0.17 * R)
    } else if (i % 5 === 0) {
      ctx.fillStyle = "white"
      const width = (i % 15 === 0 ? 0.058 : 0.042) * R
      ctx.fillRect(-width / 2, -R, width, 0.17 * R)
    } else {
      ctx.fillStyle = "rgb(78% 78% 78%)"
      ctx.fillRect(-0.008 * R, -R, 0.016 * R, 0.055 * R)
    }
    ctx.restore()
  }
  hand(ctx, model.hour, 0.5, 0.085, 0.062, 0.1)
  ctx.save()
  ctx.translate(0.012 * R, 0.017 * R)
  ctx.globalAlpha = 0.7
  ctx.shadowColor = "black"
  ctx.shadowBlur = 0.012 * R
  hand(ctx, model.minute, 0.8, 0.058, 0.04, 0.12, "black")
  ctx.restore()
  hand(ctx, model.minute, 0.8, 0.058, 0.04, 0.12)
  ctx.save()
  ctx.translate(0.018 * R, 0.025 * R)
  ctx.globalAlpha = 0.7
  ctx.shadowColor = "black"
  ctx.shadowBlur = 0.012 * R
  hand(ctx, model.second, 0.86, 0.018, 0.018, 0.26, "black")
  ctx.restore()
  hand(ctx, model.second, 0.86, 0.018, 0.018, 0.26)
  ctx.save()
  ctx.rotate(radians(model.second))
  ctx.fillStyle = "white"
  ctx.fillRect(-0.017 * R, 0.1 * R, 0.034 * R, 0.16 * R)
  ctx.restore()
  ctx.fillStyle = "white"
  ctx.beginPath()
  ctx.arc(0, 0, 0.05 * R, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = "black"
  ctx.beginPath()
  ctx.arc(0, 0, 0.016 * R, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

const digits = new Map<string, HTMLCanvasElement>()
export function clearDigitCache() {
  digits.clear()
}
function digit(value: string, scale: number) {
  const key = `${scale}:${value}`
  const cached = digits.get(key)
  if (cached) return cached
  const canvas = document.createElement("canvas")
  canvas.width = 62 * scale
  canvas.height = 90 * scale
  const ctx = canvas.getContext("2d")!
  ctx.scale(scale, scale)
  const gradient = ctx.createLinearGradient(0, 0, 0, 45)
  gradient.addColorStop(0, "rgb(1.5% 1.5% 1.5%)")
  gradient.addColorStop(1, "rgb(.8% .8% .8%)")
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.roundRect(0, 0, 62, 44, 4)
  ctx.fill()
  ctx.save()
  ctx.translate(0, 46)
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.roundRect(0, 0, 62, 44, 4)
  ctx.fill()
  ctx.restore()
  ctx.fillStyle = "white"
  ctx.font = '700 81px "Inter Display"'
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(value, 31, 47)
  ctx.clearRect(0, 44, 62, 2)
  digits.set(key, canvas)
  return canvas
}
function half(
  ctx: CanvasRenderingContext2D,
  image: HTMLCanvasElement,
  bottom: boolean,
  x: number,
  y: number,
  scale: number,
) {
  const sy = bottom ? 46 : 0
  ctx.drawImage(image, 0, sy * scale, 62 * scale, 44 * scale, x, y + sy, 62, 44)
}
export function drawFlaps(
  ctx: CanvasRenderingContext2D,
  timestamp: number,
  scale: number,
) {
  const offsets = [0, 68, 156, 224]
  for (const flap of clockModel(timestamp).flaps) {
    const x = 33 + offsets[flap.index],
      y = 324
    const old = digit(flap.old, scale),
      next = digit(flap.next, scale)
    if (!flap.changed || flap.elapsed >= 510) {
      ctx.drawImage(next, x, y, 62, 90)
      continue
    }
    if (flap.elapsed <= 0) {
      ctx.drawImage(old, x, y, 62, 90)
      continue
    }
    half(ctx, next, false, x, y, scale)
    half(ctx, old, true, x, y, scale)
    const angle = radians(flap.angle),
      sin = Math.sin(angle),
      cos = Math.cos(angle)
    if (flap.angle < 90) {
      const shade = ctx.createLinearGradient(0, y + 46, 0, y + 46 + 31)
      shade.addColorStop(0, `rgba(0,0,0,${0.6 * sin})`)
      shade.addColorStop(1, "transparent")
      ctx.fillStyle = shade
      ctx.fillRect(x, y + 46, 62, 44)
    }
    // Project thin strips of the falling flap into its own perspective camera.
    // Front = old top; after 90 degrees the back is the new bottom.
    const front = flap.angle < 90,
      image = front ? old : next
    const strip = 1 / scale
    for (let v = 0; v < 44; v += strip) {
      const local = -45 + v,
        z = -local * sin,
        projection = 288 / (288 - z)
      const yy = 45 + local * cos * projection
      const local2 = local + strip,
        z2 = -local2 * sin,
        p2 = 288 / (288 - z2)
      const yy2 = 45 + local2 * cos * p2
      const srcY = front ? v : 89 - v - strip
      const left = x + 31 - 31 * projection,
        width = 62 * projection
      ctx.drawImage(
        image,
        0,
        srcY * scale,
        62 * scale,
        strip * scale,
        left,
        y + Math.min(yy, yy2),
        width,
        Math.max(0.01, Math.abs(yy2 - yy)),
      )
      const luminance = (0.008 + 0.1 * Math.max(0, sin)) * (1 + (0.5 - v / 88))
      ctx.globalCompositeOperation = "screen"
      ctx.fillStyle = `rgb(${luminance * 100}% ${luminance * 100}% ${luminance * 100}%)`
      ctx.fillRect(
        left,
        y + Math.min(yy, yy2),
        width,
        Math.max(0.01, Math.abs(yy2 - yy)),
      )
      ctx.globalCompositeOperation = "source-over"
    }
  }
}
