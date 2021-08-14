import { useTheme } from "@emotion/react"
import styled from "@emotion/styled"
import React from "react"
import { useCanvasAnimation } from "../hooks/useCanvasAnimation"

const drawRoundRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
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

const Container = styled.div``

export type ClockProps = {
  size: number
}

export function Clock(props: ClockProps) {
  const { size } = props
  const theme = useTheme()

  const [handleRef, canvas] = useCanvasAnimation((context) => {
    const radius = size / 2
    const now = new Date()

    const drawMarkers = () => {
      context.fillStyle = theme.fontColor.normal
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
      color = theme.fontColor.normal
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
      context.arc(0, 0, 5, 0, Math.PI * 2)
      context.fillStyle = theme.color.accent
      context.fill()
    }

    context.restore()
    context.clearRect(0, 0, canvas!.width, canvas!.height)
    context.save()
    context.translate(radius, radius)

    const preciseSeconds = now.getSeconds() + now.getMilliseconds() / 1000
    const preciseMinutes = now.getMinutes() + preciseSeconds / 60
    const preciseHours = now.getHours() + preciseMinutes / 60

    drawMarkers()

    drawHandHand(preciseMinutes, 6, 0.75)
    drawHandHand(preciseHours * 2.5, 6, 0.5)
    drawCentralSpot()
    drawHandHand(preciseSeconds, 4, 0.7, theme.color.accent)
  })

  return (
    <Container>
      <canvas width={size} height={size} ref={handleRef} />
    </Container>
  )
}
