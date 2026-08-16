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
 * Enough to see each kind of programme without a wall of buttons: too short
 * for anything, a plain schedule, one with a closing slate, and two that have
 * room for news.
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
