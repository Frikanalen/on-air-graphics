import { useCallback, useRef, useSyncExternalStore } from "react"
import { resolve, type RenderedSegment } from "../plan/resolve"
import { type Plan } from "../plan/types"
import { type Playhead } from "./playhead"

/**
 * What the player should have on screen, re-rendering only when that changes.
 *
 * The playhead notifies every frame, but the answer only differs at a handover,
 * when a view finishes arriving or leaving, or when someone scrubs -- a handful
 * of times over a whole timeline. So the snapshot is cached against exactly
 * those things, and the frames in between cost a comparison and nothing else.
 *
 * The consequence is that `time.t` is a sample taken when the result last
 * changed, not a live reading. Nothing renders from it today. A view that wants
 * the moving value should read `playhead.now()` on its own clock rather than
 * make the whole tree re-render for it.
 */
export const useRenderedSegments = (
  playhead: Playhead,
  plan: Plan,
): RenderedSegment[] => {
  const cache = useRef<{
    key: string
    plan: Plan
    value: RenderedSegment[]
  } | null>(null)

  const getSnapshot = useCallback(() => {
    const rendered = resolve(plan, playhead.now())
    const key = [
      playhead.generation,
      ...rendered.map(({ index, time }) => `${index}:${time.status}`),
    ].join("|")

    const cached = cache.current
    if (cached && cached.plan === plan && cached.key === key)
      return cached.value

    cache.current = { key, plan, value: rendered }

    return rendered
  }, [playhead, plan])

  return useSyncExternalStore(playhead.subscribe, getSnapshot, getSnapshot)
}
