import { type ReactNode } from "react"
import { type ScheduleItem } from "../../schedule/types"

/**
 * Where a segment is in its own life. Derived from the playhead rather than
 * tracked as state, so any point on the timeline resolves to the same status
 * every time it is visited -- which is what lets the dev panel scrub.
 *
 * The values are a subset of react-transition-group's TransitionStatus, so a
 * status can still be handed to views that have not been converted yet.
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
  /** Whether the gradient overlay shows behind this view. Defaults to true. */
  overlay?: boolean
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
