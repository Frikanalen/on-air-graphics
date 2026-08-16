import { FADE_TRANSITION_MS } from "../../core/constants"
import { type Plan, type SegmentSpec, type SegmentStatus } from "./types"

export interface ActiveSegment {
  index: number
  spec: SegmentSpec
  time: {
    t: number
    duration: number
    status: SegmentStatus
  }
}

/**
 * What is on screen at time t. Pure, so the same instant always resolves the
 * same way: on air the playhead only moves forward, but the dev panel scrubs
 * freely and has to land on exactly the frame that would have aired.
 *
 * Past the end of the plan the last segment holds. That is the normal ending,
 * not an error -- the playout system decides when the graphics come off, and
 * until it says so there has to be something on screen.
 */
export const resolve = (plan: Plan, t: number): ActiveSegment => {
  const clamped = Math.min(Math.max(t, 0), Math.max(plan.total - 1, 0))

  const found = plan.segments.findIndex(
    (segment) => clamped < segment.start + segment.duration,
  )
  const index = found === -1 ? plan.segments.length - 1 : found

  const segment = plan.segments[index]
  const local = clamped - segment.start
  const isLast = index === plan.segments.length - 1

  /*
   * The last segment never reports "exiting": it is still holding when the
   * plan runs out, and fading it down would leave the screen empty for however
   * long the playout system takes to call stop().
   */
  const status: SegmentStatus =
    local < FADE_TRANSITION_MS
      ? "entering"
      : !isLast && segment.duration - local <= FADE_TRANSITION_MS
        ? "exiting"
        : "entered"

  return {
    index,
    spec: segment.spec,
    time: { t: local, duration: segment.duration, status },
  }
}
