import { useEffect, useState, type RefObject } from "react"

/**
 * What to scale a fixed-size box by so it fills the element being measured,
 * keeping its aspect ratio -- up as well as down.
 *
 * The graphics are authored at one resolution and have to keep it: a layout
 * that reflowed to the window would stop being a preview of what airs. So the
 * frame is scaled rather than resized, and every proportion within it holds
 * whatever size the window is.
 */
export const useFitScale = (
  ref: RefObject<HTMLElement | null>,
  width: number,
  height: number,
): number => {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      const box = entry.contentRect
      const next = Math.min(box.width / width, box.height / height)

      // The observed element does not depend on the scale, but settle for a
      // near-enough match anyway rather than re-render on sub-pixel noise.
      setScale((current) => (Math.abs(current - next) < 0.001 ? current : next))
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [ref, width, height])

  return scale
}
