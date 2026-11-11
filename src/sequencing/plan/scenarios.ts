import { plan } from "./tiers"
import { type PlanInputs, type TimelineTier } from "./types"

export interface Scenario {
  label: string
  /** A raw budget, as it would arrive in ?duration=. */
  budget: number
  tierName: string
}

/**
 * Representative slots rather than an exhaustive sweep of the boundaries.
 * Enough to compare a short schedule, a gap with the opening slate, and
 * longer schedule holds without a wall of buttons.
 */
const REPRESENTATIVE_BUDGETS = [10000, 20000, 30000, 90000, 300000]

const seconds = (ms: number) => {
  const value = ms / 1000
  return `${Number.isInteger(value) ? value : value.toFixed(1)} s`
}

/**
 * Each budget labelled with the tier it actually selects, asked of the planner
 * rather than written down -- retune a segment and the labels follow.
 */
export const scenarios = (
  tiers: TimelineTier[],
  data: PlanInputs,
): Scenario[] =>
  REPRESENTATIVE_BUDGETS.map((budget) => {
    const { tierName } = plan(budget, data, tiers)

    return { label: `${seconds(budget)} · ${tierName}`, budget, tierName }
  })
