import { FADE_TRANSITION_MS } from "../../core/constants"
import { type SequenceName } from "../../core/types"
import { allocate, minDuration } from "./allocate"
// Logo sting, next programme and news remain available for future tiers.
import { intro, orgSlate, poster, schedule } from "./segments"
import { type Plan, type PlanInputs, type TimelineTier } from "./types"

/**
 * The smallest budget this tier can be given. Derived from its segments rather
 * than declared, so adding a segment to a tier moves its threshold with it and
 * the two can never drift apart.
 */
export const tierThreshold = (tier: TimelineTier, data: PlanInputs): number =>
  tier.minBudget ?? minDuration(tier.build(data))

/**
 * Ordered poorest to richest. Each step is a different programme rather than
 * the same one stretched, and the schedule carries `grow` throughout, so
 * whatever a tier does not spend lands there rather than on a closing beat
 * that would only be held longer.
 *
 * The cream organisation slate precedes the schedule whenever the budget
 * covers its six seconds as well as the intro and schedule minimums. Shorter
 * gaps retain the two-part composition. The schedule absorbs all surplus.
 * Logo-only, next-programme and news compositions remain parked.
 */
export const INTERMISSION_TIERS: TimelineTier[] = [
  {
    name: "schedule",
    build: () => [intro(), schedule({ grow: 1, max: Infinity })],
  },
  {
    name: "slate-and-schedule",
    build: () => [intro(), orgSlate(), schedule({ grow: 1, max: Infinity })],
  },
]

/** A text poster is its own programme; the caller asks for it by name. */
export const POSTER_TIERS: TimelineTier[] = [
  {
    name: "poster",
    build: () => [poster({ grow: 1, max: Infinity })],
  },
]

export const tiersFor = (sequence: SequenceName): TimelineTier[] =>
  sequence === "poster" ? POSTER_TIERS : INTERMISSION_TIERS

/**
 * Choose the richest tier the budget can pay for, then fit it.
 *
 * The exit fade comes off the top once, here, so that no tier or segment has to
 * remember to leave room for it. If the budget cannot pay for even the poorest
 * tier, that tier is squeezed onto the timeline anyway and the plan runs long:
 * there is nothing thinner to fall back to, and going dark is worse than
 * overrunning.
 */
export const plan = (
  rawBudgetMs: number,
  data: PlanInputs,
  tiers: TimelineTier[],
): Plan => {
  const budget = Math.max(rawBudgetMs - FADE_TRANSITION_MS, 0)

  const affordable = [...tiers]
    .reverse()
    .find((tier) => tierThreshold(tier, data) <= budget)

  const tier = affordable ?? tiers[0]

  return allocate(tier.name, tier.build(data), budget)
}
