import { type ReactNode } from "react"
import { type NewsBulletin } from "../../news/types"
import { type ScheduleItem } from "../../schedule/types"

/**
 * Where a segment is in its own life. Derived from the playhead rather than
 * tracked as state, so any point on the timeline resolves to the same status
 * every time it is visited -- which is what lets the dev panel scrub.
 *
 * The names are the ones react-transition-group used, kept so that the views'
 * existing keyframe classes read the same as before.
 */
export type SegmentStatus = "entering" | "entered" | "exiting"

export interface SegmentTime {
  /** Milliseconds into this segment. */
  t: number
  /** Milliseconds this segment was allocated. */
  duration: number
  status: SegmentStatus
}

/**
 * A view's claim on the timeline, declared the way a flex child declares its
 * size: a preferred length, the bounds it may be pushed to, and how eagerly it
 * takes a share of whatever is left over.
 */
export interface SegmentSpec {
  name: string
  /** Below this the segment is not worth airing, so its tier is not selected. */
  min: number
  /** Preferred length. Must be >= min. */
  basis: number
  /** Upper bound; Infinity for a segment that can absorb any amount of slack. */
  max: number
  /** 0 is rigid. Otherwise a weight in the division of leftover time. */
  grow: number
  /**
   * How long the view's own entrance animation runs, including any delay it
   * applies to its slowest element. The status stays "entering" for exactly
   * this long: the views hang their keyframes off it, and dropping the class
   * early would abandon the animation and snap the element to its rest state.
   */
  enter: number
  /**
   * How long the view's exit animation runs. Unlike the entrance, this plays
   * *after* the segment's own time is up, over the start of the next one --
   * the intro's card falls away to reveal the schedule already sliding in.
   * So a segment's allocated duration is the time it is the current view, not
   * the time it is on screen.
   */
  exit: number
  /** Whether the gradient overlay shows behind this view. Defaults to true. */
  overlay?: boolean
  /**
   * Whether the persistent mark and clock show alongside this view. Defaults
   * to false, so a new view has to ask for them rather than inherit them.
   *
   * They are drawn once, outside the segments, and stay mounted across every
   * consecutive segment that wants them -- which is what keeps the clock from
   * restarting at each handover. A view that asks for them must leave the
   * right of the frame clear.
   */
  chrome?: boolean
  render: (time: SegmentTime) => ReactNode
}

export interface PlannedSegment {
  spec: SegmentSpec
  /** Milliseconds from the start of the plan. */
  start: number
  /** Integer milliseconds. */
  duration: number
}

export interface Plan {
  tierName: string
  /** What was available to spend, after the exit fade was reserved. */
  budget: number
  /** What was actually spent. Equal to budget except on a deliberate overrun. */
  total: number
  segments: PlannedSegment[]
}

/** Everything a tier may consult when deciding what to put on screen. */
export interface PlanInputs {
  schedule: ScheduleItem[]
  news: NewsBulletin[]
}

/**
 * One composition of views. Tiers exist where the programme should change in
 * kind rather than in length -- a five second slot and a five minute slot are
 * different programmes, not the same one stretched.
 */
export interface TimelineTier {
  name: string
  build: (data: PlanInputs) => SegmentSpec[]
  /**
   * Editorial override for the budget this tier needs. Defaults to the sum of
   * its segments' minimums, so adding a segment moves the threshold on its own.
   * Set this only once a tier is selectable but feels rushed in practice.
   */
  minBudget?: number
}
