import { useEffect, useRef } from "react"
import {
  drawAnalog,
  drawFlaps,
  clearDigitCache,
} from "../../graphics/clock/draw"
import { useClockKey } from "../../graphics/clock/ClockKey"
import { useFrame } from "../../graphics/useFrame"
import { frameClock } from "../../graphics/time"

/** Both clocks are captured on one offscreen monochrome layer and keyed once. */
export function Clock() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const { id, filter } = useClockKey()
  const scale = Math.max(1, Math.min(2, window.innerWidth / 1280))
  const draw = (timestamp: number) => {
    const el = canvas.current,
      ctx = el?.getContext("2d")
    if (!el || !ctx) return
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, 352, 446)
    drawAnalog(ctx, timestamp)
    drawFlaps(ctx, timestamp, scale)
  }
  useFrame(draw)
  useEffect(() => {
    let mounted = true
    document.fonts.ready.then(() => {
      if (mounted) {
        clearDigitCache()
        draw(frameClock.now())
      }
    })
    return () => {
      mounted = false
    }
  }, [scale])
  return (
    <>
      {filter}
      <canvas
        aria-label="Klokke, Europe/Oslo"
        className="clock-canvas"
        ref={canvas}
        width={352 * scale}
        height={446 * scale}
        style={{ filter: `url(#${id})` }}
      />
    </>
  )
}
