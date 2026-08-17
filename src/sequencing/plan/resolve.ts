import {
  type Plan,
  type SegmentSpec,
  type SegmentStatus,
  type SegmentTime,
} from "./types"

export interface RenderedSegment {
  index: number
  spec: SegmentSpec
  time: SegmentTime
}

/**
 * Everything that should be on screen at time t, oldest first.
 *
 * Usually one segment. Just after a handover there are two: the outgoing view
 * is still playing its exit over the top of the incoming one, which is how the
 * intro's card falls away to reveal the schedule already sliding in. The
 * outgoing view's `t` is measured from the moment its exit began, and its
 * `duration` is the length of that exit rather than its allocation -- by then
 * its allocation is spent and what it is doing is finishing an animation.
 *
 * Pure, so the same instant always resolves the same way: on air the playhead
 * only moves forward, but the dev panel scrubs freely and has to land on
 * exactly the frame that would have aired.
 */
export const resolve = (plan: Plan, t: number): RenderedSegment[] => {
  if (plan.segments.length === 0) return []

  const clamped = Math.min(Math.max(t, 0), Math.max(plan.total - 1, 0))

  const found = plan.segments.findIndex(
    (segment) => clamped < segment.start + segment.duration,
  )
  const index = found === -1 ? plan.segments.length - 1 : found

  const segment = plan.segments[index]
  const local = clamped - segment.start

  /*
   * The current view never reports "exiting". It hands over at the end of its
   * allocation and keeps animating from the outgoing slot below, so the status
   * it sees is only ever about arriving or being here.
   */
  const active: RenderedSegment = {
    index,
    spec: segment.spec,
    time: {
      t: local,
      duration: segment.duration,
      status: local < segment.spec.enter ? "entering" : "entered",
    },
  }

  const previous = plan.segments[index - 1]

  // The one it just took over from, if that one is still animating out.
  if (previous && local < previous.spec.exit)
    return [
      {
        index: index - 1,
        spec: previous.spec,
        time: {
          t: local,
          duration: previous.spec.exit,
          status: "exiting" satisfies SegmentStatus,
        },
      },
      active,
    ]

  return [active]
}

/** The segment that owns the timeline at time t, ignoring anything exiting. */
export const activeSegment = (plan: Plan, t: number): RenderedSegment => {
  const rendered = resolve(plan, t)
  return rendered[rendered.length - 1]
}
