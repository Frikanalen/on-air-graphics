import { frameClock } from "../../graphics/time"
/**
 * The clock the timeline is read against.
 *
 * Deliberately not React state. The playhead moves every frame, and pushing
 * that through setState would re-render the tree fifty times a second to
 * produce identical output -- the views animate in CSS and only care which
 * segment they are in. So it is a plain store: components subscribe and decide
 * for themselves what is worth re-rendering for.
 */
export interface Playhead {
  /** Milliseconds since the timeline started. Readable at any time. */
  now(): number
  readonly playing: boolean
  /**
   * Bumped whenever the playhead jumps rather than advances. Scrubbing back
   * into a view that is already on screen has to replay its entrance, and a
   * remount is what does that -- so this belongs in the React key.
   */
  readonly generation: number
  seek(t: number): void
  pause(): void
  resume(): void
  /** Back to zero and running. */
  restart(): void
  subscribe(listener: () => void): () => void
}

export const createPlayhead = (): Playhead => {
  /*
   * The clock is an anchor pair rather than a counter: a time on the timeline
   * and the wall clock reading it was taken at. Every read is arithmetic on
   * those two, so nothing accumulates drift and a dropped frame costs nothing.
   */
  let baseT = 0
  let baseWall = 0

  let playing = false
  let generation = 0
  let stopFrame: (() => void) | undefined

  const listeners = new Set<() => void>()
  const notify = () => {
    for (const listener of listeners) listener()
  }

  const now = () => (playing ? baseT + (frameClock.now() - baseWall) : baseT)

  const anchor = (t: number) => {
    baseT = Math.max(t, 0)
    baseWall = frameClock.now()
  }

  const startTicking = () => {
    if (stopFrame === undefined) stopFrame = frameClock.subscribe(notify)
  }
  const stopTicking = () => {
    stopFrame?.()
    stopFrame = undefined
  }

  return {
    now,

    get playing() {
      return playing
    },

    get generation() {
      return generation
    },

    seek(t: number) {
      anchor(t)
      generation += 1
      notify()
    },

    pause() {
      if (!playing) return

      anchor(now())
      playing = false
      stopTicking()
      notify()
    },

    resume() {
      if (playing) return

      startTicking()
      anchor(baseT)
      playing = true
      notify()
    },

    restart() {
      startTicking()
      anchor(0)
      playing = true
      generation += 1
      notify()
    },

    subscribe(listener: () => void) {
      listeners.add(listener)

      /*
       * Ticking follows "playing, and someone is listening" -- the symmetric
       * half of the teardown below. Without this, a moment with no listeners
       * stops the frame loop for good: the last one out cancels it and nothing
       * starts it again, so `now()` goes on advancing while every subscriber
       * sits on the snapshot it last saw. React remounts effects in
       * StrictMode, which is exactly such a moment.
       */
      if (playing) startTicking()

      return () => {
        listeners.delete(listener)
        if (listeners.size === 0) stopTicking()
      }
    },
  }
}
