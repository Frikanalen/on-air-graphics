import { describe, expect, it } from "vitest"
import {
  type Dependencies,
  POLL_INTERVAL_MS,
  RECONNECT_DELAY_MS,
  subscribeToScheduleChanges,
} from "./scheduleUpdates"

class FakeSource {
  readyState = 1
  closed = false
  onerror: ((event: Event) => void) | null = null
  listeners = new Map<string, () => void>()
  constructor(readonly url: string) {}
  addEventListener(type: string, listener: () => void) {
    this.listeners.set(type, listener)
  }
  emit(type: string) {
    this.listeners.get(type)?.()
  }
  fail(closed: boolean) {
    this.readyState = closed ? 2 : 0
    this.onerror?.(new Event("error"))
  }
  close() {
    this.closed = true
  }
}

const fakes = () => {
  const sources: FakeSource[] = []
  const timers: Array<{ callback: () => void; ms: number; cleared: boolean }> =
    []
  const deps: Dependencies = {
    createEventSource: (url) => {
      const source = new FakeSource(url)
      sources.push(source)
      return source
    },
    setTimeout: (callback, ms) =>
      timers.push({ callback, ms, cleared: false }) - 1,
    clearTimeout: (handle) => {
      timers[handle as number].cleared = true
    },
    setInterval: (callback, ms) =>
      timers.push({ callback, ms, cleared: false }) - 1,
    clearInterval: (handle) => {
      timers[handle as number].cleared = true
    },
  }
  return { sources, timers, deps }
}

describe("subscribeToScheduleChanges", () => {
  it("refetches on every playout event, but not on other messages", () => {
    const { sources, deps } = fakes()
    let changes = 0
    subscribeToScheduleChanges("/api/playout/events", () => changes++, deps)

    expect(sources[0].url).toBe("/api/playout/events")
    sources[0].emit("hello")
    sources[0].emit("resync")
    sources[0].emit("schedule.changed")
    sources[0].emit("something.else")
    expect(changes).toBe(3)
  })

  it("polls as a fallback", () => {
    const { timers, deps } = fakes()
    let changes = 0
    subscribeToScheduleChanges("/e", () => changes++, deps)

    const poll = timers.find((timer) => timer.ms === POLL_INTERVAL_MS)
    poll?.callback()
    expect(changes).toBe(1)
  })

  it("reconnects once EventSource has given up, and leaves it alone otherwise", () => {
    const { sources, timers, deps } = fakes()
    subscribeToScheduleChanges("/e", () => {}, deps)

    // A dropped connection: EventSource is already reconnecting on its own.
    sources[0].fail(false)
    expect(timers.some((timer) => timer.ms === RECONNECT_DELAY_MS)).toBe(false)

    // An error response: it will not try again, so we do.
    sources[0].fail(true)
    const retry = timers.find((timer) => timer.ms === RECONNECT_DELAY_MS)
    retry?.callback()
    expect(sources).toHaveLength(2)
  })

  it("stops cleanly", () => {
    const { sources, timers, deps } = fakes()
    const stop = subscribeToScheduleChanges("/e", () => {}, deps)
    sources[0].fail(true)

    stop()
    expect(sources[0].closed).toBe(true)
    expect(timers.every((timer) => timer.cleared)).toBe(true)
  })
})
