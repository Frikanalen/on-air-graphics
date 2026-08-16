import { describe, expect, it } from "vitest"
import { planInputs, tier } from "./fixtures"
import { scenarios } from "./scenarios"
import { INTERMISSION_TIERS, POSTER_TIERS, plan } from "./tiers"

const data = planInputs()
const ladder = [
  tier("poor", 5000),
  tier("middling", 20000),
  tier("rich", 60000),
]

describe("scenarios", () => {
  it("names the tier each budget actually selects", () => {
    for (const scenario of scenarios(ladder, data))
      expect(plan(scenario.budget, data, ladder).tierName).toBe(
        scenario.tierName,
      )
  })

  it("offers a short list rather than every boundary", () => {
    expect(scenarios(ladder, data)).toHaveLength(5)
  })

  it("returns unique budgets in ascending order", () => {
    const budgets = scenarios(ladder, data).map((s) => s.budget)

    expect([...budgets].sort((a, b) => a - b)).toEqual(budgets)
    expect(new Set(budgets).size).toBe(budgets.length)
  })

  it("labels each scenario with its length and tier", () => {
    const [first] = scenarios(ladder, data)

    expect(first.label).toBe("10 s · poor")
  })

  it("reaches every kind of programme the shipped tiers offer", () => {
    const named = scenarios(INTERMISSION_TIERS, data).map((s) => s.tierName)

    expect(new Set(named)).toEqual(new Set(["schedule"]))
  })

  it("works for the poster tier too", () => {
    for (const scenario of scenarios(POSTER_TIERS, data))
      expect(plan(scenario.budget, data, POSTER_TIERS).tierName).toBe(
        scenario.tierName,
      )
  })
})
