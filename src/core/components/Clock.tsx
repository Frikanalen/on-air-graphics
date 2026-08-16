import { useMemo } from "react"
import { useCanvasAnimation } from "../hooks/useCanvasAnimation"

/**
 * A canvas context can't consume CSS custom properties, so the theme tokens
 * have to be resolved to concrete colour strings first.
 */
const readColor = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim()

const drawRoundRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  context.beginPath()
  context.arc(x + radius, y + radius, radius, Math.PI, Math.PI + Math.PI / 2)
  context.lineTo(x + width - radius, y)
  context.arc(x + width - radius, y + radius, radius, Math.PI + Math.PI / 2, 0)
  context.lineTo(x + width, y + height - radius)
  context.arc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2)
  context.lineTo(x + radius, y + height)
  context.arc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI)
  context.lineTo(x, y + radius)
  context.fill()
}

export type ClockProps = {
  size: number
}

export function Clock({ size }: ClockProps) {
  const colors = useMemo(
    () => ({
      normal: readColor("--fk-font-color-normal"),
      accent: readColor("--fk-color-accent"),
    }),
    [],
  )

  const [handleRef, canvas] = useCanvasAnimation((context) => {
    const radius = size / 2
    const now = new Date()

    const drawMarkers = () => {
      context.fillStyle = colors.normal
      context.save()

      const width = 6
      const height = 30
      const distance = radius - height

      for (let step = 0; step < 12; step++) {
        context.rotate(Math.PI / 6)
        drawRoundRect(context, -width / 2, distance, width, height, 3)
      }

      context.restore()
    }

    const drawHandHand = (
      time: number,
      thickness: number,
      length: number,
      color = colors.normal,
    ) => {
      context.save()
      const width = thickness
      const height = (size / 2) * length

      context.fillStyle = color
      context.rotate((time * Math.PI) / 30 + Math.PI)
      drawRoundRect(context, -width / 2.0, 0, width, height, width / 2)

      context.restore()
    }

    const drawCentralSpot = () => {
      context.beginPath()
      context.arc(0, 0, 7, 0, Math.PI * 2)
      context.fillStyle = colors.accent
      context.fill()
    }

    context.restore()
    context.clearRect(0, 0, canvas!.width, canvas!.height)
    context.save()
    context.translate(radius, radius)

    const preciseSeconds = now.getSeconds() + now.getMilliseconds() / 1000
    const preciseMinutes = now.getMinutes() + preciseSeconds / 60
    const preciseHours = (now.getHours() + preciseMinutes / 60) % 12

    drawMarkers()

    drawHandHand(preciseMinutes, 6, 0.75)
    drawHandHand(preciseHours * 5, 6, 0.5)
    drawCentralSpot()
    drawHandHand(preciseSeconds, 4, 0.7, colors.accent)
  })

  return <canvas width={size} height={size} ref={handleRef} />
}
