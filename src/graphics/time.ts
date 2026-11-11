import { useSyncExternalStore } from "react"

export const FPS = 50
export const FRAME_MS = 1000 / FPS
export const OSLO = "Europe/Oslo"
const parts = new Intl.DateTimeFormat("en-GB", {
  timeZone: OSLO,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
})

export function osloParts(timestamp: number) {
  const values = Object.fromEntries(
    parts.formatToParts(timestamp).map((p) => [p.type, Number(p.value)]),
  )
  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
    second: values.second,
  }
}

/** An ISO string without an offset is Oslo civil time, regardless of the host TZ.
 * At the autumn fold choose the earlier occurrence; reject nonexistent spring times. */
export function parseTimestamp(value: string): number {
  if (/(Z|[+-]\d{2}:?\d{2})$/i.test(value)) {
    const timestamp = Date.parse(value)
    if (!Number.isFinite(timestamp))
      throw new Error(`Invalid timestamp: ${value}`)
    return timestamp
  }
  const match =
    /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(\.\d{1,3})?$/.exec(
      value,
    )
  if (!match)
    throw new Error(
      "t must be an ISO timestamp (with seconds), in Europe/Oslo or with an explicit offset",
    )
  const [, y, m, d, h, min, s, fraction = "0"] = match
  const civil = Date.UTC(
    +y,
    +m - 1,
    +d,
    +h,
    +min,
    +s,
    Math.round(+fraction * 1000),
  )
  for (const offset of [2, 1]) {
    const candidate = civil - offset * 3600000
    const p = osloParts(candidate)
    if (
      p.year === +y &&
      p.month === +m &&
      p.day === +d &&
      p.hour === +h &&
      p.minute === +min &&
      p.second === +s
    )
      return candidate
  }
  throw new Error(`Nonexistent Oslo time: ${value}`)
}

export function formatTime(timestamp: number): string {
  const { hour, minute } = osloParts(timestamp)
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
}

// This is the only wall-clock read in the application. Frozen inputs retain
// sub-frame precision (e.g. .212); the live clock publishes at exactly 50 fps.
const injected = new URLSearchParams(
  typeof window === "undefined" ? "" : window.location.search,
).get("t")
export const frozen = injected !== null
let timestamp = injected === null ? Date.now() : parseTimestamp(injected)
const listeners = new Set<() => void>()
let frame: number | undefined
let revision = 0
let rafAnchor: number | undefined
let lastFrame = -1
export const frameClock = {
  now: () => timestamp,
  revision: () => revision,
  subscribe(listener: () => void) {
    listeners.add(listener)
    const tick = (rafTime: number) => {
      frame = requestAnimationFrame(tick)
      rafAnchor ??= rafTime
      const frameIndex = Math.round((rafTime - rafAnchor) / FRAME_MS)
      if (frameIndex <= lastFrame) return
      lastFrame = frameIndex
      if (!frozen) timestamp = Math.floor(Date.now() / FRAME_MS) * FRAME_MS
      revision += 1
      listeners.forEach((notify) => notify())
    }
    // Even a frozen frame is presented at 50 fps: CEF's offscreen producer
    // needs a repaint heartbeat. Its timestamp and resulting pixels stay fixed.
    if (frame === undefined) {
      if (!frozen) timestamp = Math.floor(Date.now() / FRAME_MS) * FRAME_MS
      rafAnchor = undefined
      lastFrame = -1
      frame = requestAnimationFrame(tick)
    }
    return () => {
      listeners.delete(listener)
      if (!listeners.size) {
        if (frame !== undefined) cancelAnimationFrame(frame)
        frame = undefined
      }
    }
  },
}

export const useTimestamp = () =>
  useSyncExternalStore(frameClock.subscribe, frameClock.now)
