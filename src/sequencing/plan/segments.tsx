import { IntroView } from "../../core/components/IntroView"
import { LogoStingView } from "../../core/components/LogoStingView"
import { OrgSlateView } from "../../core/components/OrgSlateView"
import { NewsPosterView } from "../../news/components/NewsPosterView"
import { type NewsBulletin } from "../../news/types"
import { PosterView } from "../../poster/components/PosterView"
import { NextProgramView } from "../../schedule/components/NextProgramView"
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

/** Long enough to take in the mark and no longer; it is a sting. */
const STING_MIN_MS = 3200
const STING_BASIS_MS = 5000
const STING_MAX_MS = 10000

/** Long enough to read one programme title and who is behind it. */
const NEXT_MIN_MS = 8000
const NEXT_BASIS_MS = 15000

/** A headline and a sentence. */
const NEWS_MIN_MS = 5000
const NEWS_BASIS_MS = 8000

/** Two sentences, read once, unhurried. */
const SLATE_MS = 6000

/*
 * However many bulletins the feed offers, only this many are ever planned.
 * A tier's threshold is the sum of its segments' minimums, so an unbounded
 * count would push the news tier out of reach of any real budget and quietly
 * mean no news ever aired.
 */
const MAX_NEWS_POSTERS = 3

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
  // Its card is the frame, so the frost comes from the background itself.
  blurBackground: true,
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
  clock: true,
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

export const logoSting = (bounds: Bounds = {}): SegmentSpec => ({
  name: "logo",
  min: STING_MIN_MS,
  basis: STING_BASIS_MS,
  max: STING_MAX_MS,
  grow: 0,
  enter: INTRO_ENTER_MS,
  exit: POSTER_EXIT_MS,
  // Nothing behind the mark but the channel's own background.
  overlay: false,
  render: ({ status }) => <LogoStingView status={status} />,
  ...bounds,
})

export const nextProgram = (bounds: Bounds = {}): SegmentSpec => ({
  name: "next",
  min: NEXT_MIN_MS,
  basis: NEXT_BASIS_MS,
  max: Infinity,
  grow: 1,
  enter: SCHEDULE_EXIT_MS,
  exit: SCHEDULE_EXIT_MS,
  clock: true,
  render: ({ status }) => <NextProgramView status={status} />,
  ...bounds,
})

/** One segment per bulletin, capped -- see MAX_NEWS_POSTERS. */
export const newsPosters = (
  news: NewsBulletin[],
  bounds: Bounds = {},
): SegmentSpec[] =>
  news.slice(0, MAX_NEWS_POSTERS).map((bulletin) => ({
    name: `news:${bulletin.id}`,
    min: NEWS_MIN_MS,
    basis: NEWS_BASIS_MS,
    max: Infinity,
    grow: 0,
    enter: POSTER_ENTER_MS,
    exit: POSTER_EXIT_MS,
    clock: true,
    render: ({ status }) => (
      <NewsPosterView status={status} bulletin={bulletin} />
    ),
    ...bounds,
  }))

export const orgSlate = (bounds: Bounds = {}): SegmentSpec => ({
  name: "slate",
  min: SLATE_MS,
  basis: SLATE_MS,
  max: SLATE_MS,
  grow: 0,
  enter: POSTER_ENTER_MS,
  exit: POSTER_EXIT_MS,
  clock: true,
  render: ({ status }) => <OrgSlateView status={status} />,
  ...bounds,
})
