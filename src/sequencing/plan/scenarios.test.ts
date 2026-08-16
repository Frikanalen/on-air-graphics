import { describe, expect, it } from "vitest"
import { tier } from "./fixtures"
import { scenarios } from "./scenarios"
import { INTERMISSION_TIERS, plan, tierThreshold } from "./tiers"
import { type PlanInputs } from "./types"

const data: PlanInputs = { schedule: [] }
const ladder = [
  tier("poor", 5000),
  tier("middling", 20000),
  tier("rich", 60000),
]

describe("scenarios", () => {
  it("offers a budget that selects each tier it names", () => {
    for (const scenario of scenarios(ladder, data))
      expect(plan(scenario.budget, data, ladder).tierName).toBe(
        scenario.tierName,
      )
  })

  it("brackets every threshold from both sides", () => {
    const budgets = scenarios(ladder, data).map((s) => s.budget)

    for (const t of ladder) {
      const threshold = tierThreshold(t, data)

      expect(budgets.some((b) => b <= threshold + 500)).toBe(true)
      expect(budgets.some((b) => b > threshold)).toBe(true)
    }
  })

  it("returns unique budgets in ascending order", () => {
    const budgets = scenarios(ladder, data).map((s) => s.budget)

    expect([...budgets].sort((a, b) => a - b)).toEqual(budgets)
    expect(new Set(budgets).size).toBe(budgets.length)
  })

  it("labels each scenario with its tier and length", () => {
    const [first] = scenarios(ladder, data)

    expect(first.label).toContain("poor")
    expect(first.label).toContain("s")
  })

  it("reaches past the richest tier so long slots can be checked", () => {
    const budgets = scenarios(ladder, data).map((s) => s.budget)

    expect(Math.max(...budgets)).toBeGreaterThanOrEqual(300000)
  })

  it("never offers a budget too small for the tier it names", () => {
    // Thresholds 300ms apart, so the "stretched" budget for the lower tier
    // would otherwise be pushed below its own threshold.
    const crowded = [tier("a", 10000), tier("b", 10300)]

    for (const scenario of scenarios(crowded, data))
      expect(plan(scenario.budget, data, crowded).tierName).toBe(
        scenario.tierName,
      )
  })

  it("works for the shipped tiers", () => {
    const shipped = scenarios(INTERMISSION_TIERS, data)

    expect(shipped.length).toBeGreaterThan(0)

    for (const scenario of shipped)
      expect(plan(scenario.budget, data, INTERMISSION_TIERS).tierName).toBe(
        scenario.tierName,
      )
  })
})
