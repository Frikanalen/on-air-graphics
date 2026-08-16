import { FADE_TRANSITION_MS, type SequenceName } from "../../core/constants"
import { allocate, minDuration } from "./allocate"
import { intro, poster, schedule } from "./segments"
import { type Plan, type PlanInputs, type TimelineTier } from "./types"

/**
 * The smallest budget this tier can be given. Derived from its segments rather
 * than declared, so adding a segment to a tier moves its threshold with it and
 * the two can never drift apart.
 */
export const tierThreshold = (tier: TimelineTier, data: PlanInputs): number =>
  tier.minBudget ?? minDuration(tier.build(data))

/**
 * Ordered poorest to richest. Only "full" exists so far: the poorer tiers are
 * waiting on views of their own (a logo sting, a single upcoming programme),
 * and a tier whose views do not exist yet is simply left out -- selection skips
 * whatever is not in the array.
 */
export const INTERMISSION_TIERS: TimelineTier[] = [
  {
    name: "full",
    build: () => [intro(), schedule({ grow: 1, max: Infinity })],
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
