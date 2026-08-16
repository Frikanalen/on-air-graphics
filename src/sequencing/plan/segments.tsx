import { IntroView } from "../../core/components/IntroView"
import { PosterView } from "../../poster/components/PosterView"
import { ScheduleView } from "../../schedule/components/ScheduleView"
import { type SegmentSpec } from "./types"

/**
 * A tier decides which of its segments absorbs the leftover time, so the
 * elastic bounds are supplied at the call site rather than baked into the
 * segment. Everything else about a segment stays the same wherever it airs.
 */
type Bounds = Partial<Pick<SegmentSpec, "grow" | "max">>

/*
 * The animation lengths below are read off index.css, and have to stay in step
 * with it: a status is held for exactly as long as the keyframes it drives, so
 * a value that is too short drops the class mid-animation and snaps the element
 * to its rest state. Where a view delays its slowest element, the delay counts.
 */

/*
 * The intro is rigid: it is a fixed animation, and stretching it just leaves
 * the logo sitting still. 1200ms of entrance plus a 2000ms hold, matching
 * IntroView's own timing.
 */
const INTRO_MS = 3200
/** logo-unblur: 1200ms, after a 200ms delay. */
const INTRO_ENTER_MS = 1400
/** card-fall and logo-fall, both 700ms. */
const INTRO_EXIT_MS = 700

/** Long enough to read the next programme and glance at the ones after it. */
const SCHEDULE_MIN_MS = 12000
const SCHEDULE_BASIS_MS = 20000
/** schedule-in and schedule-out: 1000ms, and the second card delays by 100ms. */
const SCHEDULE_ENTER_MS = 1100
const SCHEDULE_EXIT_MS = 1100

const POSTER_MIN_MS = 5000
const POSTER_BASIS_MS = 10000
/** poster-in and poster-out both run for --fk-fade-transition. */
const POSTER_ENTER_MS = 500
const POSTER_EXIT_MS = 500

export const intro = (bounds: Bounds = {}): SegmentSpec => ({
  name: "intro",
  min: INTRO_MS,
  basis: INTRO_MS,
  max: INTRO_MS,
  grow: 0,
  enter: INTRO_ENTER_MS,
  exit: INTRO_EXIT_MS,
  // The intro paints its own card; the gradient would only muddy it.
  overlay: false,
  render: ({ status }) => <IntroView status={status} />,
  ...bounds,
})

export const schedule = (bounds: Bounds = {}): SegmentSpec => ({
  name: "schedule",
  min: SCHEDULE_MIN_MS,
  basis: SCHEDULE_BASIS_MS,
  max: Infinity,
  grow: 1,
  enter: SCHEDULE_ENTER_MS,
  exit: SCHEDULE_EXIT_MS,
  render: ({ status }) => <ScheduleView status={status} />,
  ...bounds,
})

export const poster = (bounds: Bounds = {}): SegmentSpec => ({
  name: "poster",
  min: POSTER_MIN_MS,
  basis: POSTER_BASIS_MS,
  max: Infinity,
  grow: 1,
  enter: POSTER_ENTER_MS,
  exit: POSTER_EXIT_MS,
  render: ({ status }) => <PosterView transition={status} />,
  ...bounds,
})
