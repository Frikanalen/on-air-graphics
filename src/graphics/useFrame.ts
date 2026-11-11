import { useEffect, useRef } from "react"
import { type Playhead } from "../sequencing/clock/playhead"
import { frameClock } from "./time"

/** Imperative draws share one timestamp and bypass React's reconciliation. */
export function useFrame(
  draw: (timestamp: number) => void,
  playhead?: Playhead,
) {
  const callback = useRef(draw)
  callback.current = draw
  useEffect(() => {
    let last = ""
    const frame = () => {
      const timestamp = frameClock.now()
      const key = `${frameClock.revision()}:${timestamp}:${playhead?.now()}:${playhead?.generation}`
      if (key === last) return
      last = key
      callback.current(timestamp)
    }
    frame()
    const offClock = frameClock.subscribe(frame)
    const offPlayhead = playhead?.subscribe(frame)
    return () => {
      offClock()
      offPlayhead?.()
    }
  }, [playhead])
}
