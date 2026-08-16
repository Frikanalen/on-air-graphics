import { FADE_TRANSITION_MS } from "../../core/constants"
import { tierThreshold } from "./tiers"
import { type PlanInputs, type TimelineTier } from "./types"

export interface Scenario {
  label: string
  /**
   * A raw budget, as it would arrive in ?duration= -- the exit fade is added
   * back on, so feeding this to plan() selects the tier named in the label.
   */
  budget: number
  tierName: string
}

const seconds = (ms: number) => {
  const value = ms / 1000
  return `${Number.isInteger(value) ? value : value.toFixed(1)} s`
}

/** Budgets past the richest tier's threshold, where nothing changes tier. */
const COMFORTABLE_MS = 90000
const GENEROUS_MS = 300000

/**
 * The budgets worth looking at are the ones around the tier boundaries, and
 * those move whenever a segment is retuned -- so they are derived here rather
 * than written down. Each tier contributes the budget that just selects it
 * (everything at its minimum), a middling one, and the last budget before the
 * next tier takes over (its elastic segments stretched as far as they go).
 */
export const scenarios = (
  tiers: TimelineTier[],
  data: PlanInputs,
): Scenario[] => {
  const found = new Map<number, Scenario>()

  const add = (
    tierName: string,
    note: string,
    budget: number,
    floor: number,
  ) => {
    // Two tiers can sit close enough together that the "stretched" budget for
    // the lower one lands under its own threshold, where it would select the
    // tier below instead and the label would be a lie.
    const rounded = Math.max(Math.round(budget), floor)
    if (found.has(rounded)) return

    found.set(rounded, {
      label: `${tierName} · ${seconds(rounded)}${note}`,
      budget: rounded,
      tierName,
    })
  }

  tiers.forEach((tier, i) => {
    // plan() spends the budget it is given minus the fade, so a scenario has to
    // hand back a budget that still clears the threshold once that is taken off.
    const threshold = tierThreshold(tier, data) + FADE_TRANSITION_MS
    const next = tiers[i + 1]
    const ceiling = next
      ? tierThreshold(next, data) + FADE_TRANSITION_MS
      : undefined

    add(tier.name, " (min)", threshold, threshold)

    if (ceiling === undefined) {
      add(tier.name, "", COMFORTABLE_MS, threshold)
      add(tier.name, "", GENEROUS_MS, threshold)
      return
    }

    add(tier.name, "", (threshold + ceiling) / 2, threshold)
    add(tier.name, " (max)", ceiling - 1000, threshold)
  })

  return [...found.values()].sort((a, b) => a.budget - b.budget)
}
