/*
 * Django pushes a nudge down /api/playout/events whenever the schedule
 * changes, so a graphic on air for a long gap still shows a live slot booked
 * minutes ago. Every event means "fetch the schedule again": `hello` on
 * connect, `resync` after a gap, `schedule.changed` for an edit.
 *
 * EventSource reconnects by itself after a dropped connection, but gives up
 * for good on an error response such as a 503, so that case is retried here.
 * A slow poll covers anything the stream misses.
 */
export const EVENT_TYPES = ["hello", "resync", "schedule.changed"] as const
export const POLL_INTERVAL_MS = 60_000
export const RECONNECT_DELAY_MS = 5_000

interface EventSourceLike {
  readyState: number
  onerror: ((event: Event) => void) | null
  addEventListener: (type: string, listener: () => void) => void
  close: () => void
}

export interface Dependencies {
  createEventSource: (url: string) => EventSourceLike
  setTimeout: (callback: () => void, ms: number) => unknown
  clearTimeout: (handle: unknown) => void
  setInterval: (callback: () => void, ms: number) => unknown
  clearInterval: (handle: unknown) => void
}

const CLOSED = 2

const browser: Dependencies = {
  createEventSource: (url) => new EventSource(url),
  setTimeout: (callback, ms) => window.setTimeout(callback, ms),
  clearTimeout: (handle) => window.clearTimeout(handle as number),
  setInterval: (callback, ms) => window.setInterval(callback, ms),
  clearInterval: (handle) => window.clearInterval(handle as number),
}

/** Call onChange whenever the schedule may have changed; returns a stop function. */
export const subscribeToScheduleChanges = (
  url: string,
  onChange: () => void,
  deps: Dependencies = browser,
) => {
  let source: EventSourceLike | null = null
  let retry: unknown = null
  let stopped = false

  const connect = () => {
    retry = null
    if (stopped) return
    source = deps.createEventSource(url)
    for (const type of EVENT_TYPES) source.addEventListener(type, onChange)
    source.onerror = () => {
      if (source?.readyState !== CLOSED || retry !== null) return
      retry = deps.setTimeout(connect, RECONNECT_DELAY_MS)
    }
  }

  connect()
  const poll = deps.setInterval(onChange, POLL_INTERVAL_MS)

  return () => {
    stopped = true
    source?.close()
    if (retry !== null) deps.clearTimeout(retry)
    deps.clearInterval(poll)
  }
}
