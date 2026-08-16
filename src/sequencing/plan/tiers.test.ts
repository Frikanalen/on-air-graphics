import { describe, expect, it } from "vitest"
import { FADE_TRANSITION_MS } from "../../core/constants"
import { segment, tier } from "./fixtures"
import { INTERMISSION_TIERS, POSTER_TIERS, plan, tierThreshold } from "./tiers"
import { type PlanInputs, type TimelineTier } from "./types"

const data: PlanInputs = { schedule: [] }

const poor = tier("poor", 5000)
const middling = tier("middling", 20000)
const rich = tier("rich", 60000)
const ladder = [poor, middling, rich]

/** The budget that just barely selects a tier, once the fade is accounted for. */
const justEnoughFor = (t: TimelineTier) =>
  tierThreshold(t, data) + FADE_TRANSITION_MS

describe("tierThreshold", () => {
  it("derives the threshold from the segments' minimums", () => {
    expect(tierThreshold(tier("t", 15200), data)).toBe(15200)
  })

  it("prefers an explicit editorial override", () => {
    expect(tierThreshold({ ...tier("t", 15200), minBudget: 45000 }, data)).toBe(
      45000,
    )
  })
})

describe("plan", () => {
  it("reserves the exit fade off the top of the budget", () => {
    expect(plan(60000, data, ladder).budget).toBe(60000 - FADE_TRANSITION_MS)
  })

  it("picks the richest tier the budget can pay for", () => {
    expect(plan(justEnoughFor(rich), data, ladder).tierName).toBe("rich")
    expect(plan(justEnoughFor(middling), data, ladder).tierName).toBe(
      "middling",
    )
    expect(plan(justEnoughFor(poor), data, ladder).tierName).toBe("poor")
  })

  it("drops to the poorer tier one millisecond below a threshold", () => {
    expect(plan(justEnoughFor(rich) - 1, data, ladder).tierName).toBe(
      "middling",
    )
  })

  it("squeezes the poorest tier when nothing is affordable", () => {
    const squeezed = plan(1000, data, ladder)

    expect(squeezed.tierName).toBe("poor")
    expect(squeezed.budget).toBe(500)
    // Overrunning is the deliberate last resort: there is nothing thinner.
    expect(squeezed.total).toBe(5000)
  })

  it("respects an override that holds a tier back", () => {
    const fussy: TimelineTier = { ...rich, minBudget: 120000 }
    const tiers = [poor, middling, fussy]

    expect(plan(70000, data, tiers).tierName).toBe("middling")
    expect(plan(130000, data, tiers).tierName).toBe("rich")
  })

  it("hands the surplus to the segment that can absorb it", () => {
    const tiers = [
      {
        name: "two-part",
        build: () => [
          segment("rigid", { min: 3200, basis: 3200, max: 3200 }),
          segment("open", { min: 12000, basis: 12000, grow: 1 }),
        ],
      },
    ]

    const result = plan(60000, data, tiers)
    const [rigid, open] = result.segments

    expect(rigid.duration).toBe(3200)
    expect(open.duration).toBe(60000 - FADE_TRANSITION_MS - 3200)
    expect(result.total).toBe(60000 - FADE_TRANSITION_MS)
  })
})

describe("the shipped tiers", () => {
  it("fills a long slot with the full intermission", () => {
    const result = plan(290000, data, INTERMISSION_TIERS)

    expect(result.tierName).toBe("full")
    expect(result.segments.map((s) => s.spec.name)).toEqual([
      "intro",
      "schedule",
    ])
    expect(result.total).toBe(290000 - FADE_TRANSITION_MS)
  })

  it("still airs something when the slot is far too short", () => {
    const result = plan(4000, data, INTERMISSION_TIERS)

    expect(result.tierName).toBe("full")
    expect(result.segments.every((s) => s.duration >= s.spec.min)).toBe(true)
  })

  it("gives the whole slot to the poster", () => {
    const result = plan(30000, data, POSTER_TIERS)

    expect(result.tierName).toBe("poster")
    expect(result.segments).toHaveLength(1)
    expect(result.segments[0].duration).toBe(30000 - FADE_TRANSITION_MS)
  })

  it("leaves every tier able to absorb an arbitrarily long slot", () => {
    for (const tiers of [INTERMISSION_TIERS, POSTER_TIERS])
      for (const t of tiers)
        expect(
          t.build(data).some((s) => s.grow > 0 && s.max === Infinity),
        ).toBe(true)
  })
})
