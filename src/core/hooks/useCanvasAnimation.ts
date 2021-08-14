import { useEffect, useRef, useState } from "react"

export type CanvasAnimationHandler = (
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) => void

export const useCanvasAnimation = (
  frame: CanvasAnimationHandler,
  enabled = true
) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | undefined>()
  const frameRef = useRef<number>()

  const handleRef = (element: HTMLCanvasElement | null) => {
    if (element) {
      return setCanvas(element)
    }

    setCanvas(undefined)
  }

  useEffect(() => {
    const frameHandler: CanvasAnimationHandler = (context, canvas) => {
      frame(context, canvas)
      frameRef.current = requestAnimationFrame(() =>
        frameHandler(context, canvas)
      )
    }

    if (canvas && enabled) {
      const context = canvas.getContext("2d")
      if (!context) throw new Error("Couldn't get 2D context")

      frameHandler(context, canvas)
    }

    return () => {
      cancelAnimationFrame(frameRef.current as number)
    }
  }, [enabled, frame, canvas])

  return [handleRef, canvas] as const
}
