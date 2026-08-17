import { describe, expect, it } from "vitest"
import { FADE_TRANSITION_MS } from "../../core/constants"
import { planInputs, segment, tier } from "./fixtures"
import {
  intro,
  logoSting,
  newsPosters,
  nextProgram,
  orgSlate,
  schedule,
} from "./segments"
import { INTERMISSION_TIERS, POSTER_TIERS, plan, tierThreshold } from "./tiers"
import { type TimelineTier } from "./types"

const data = planInputs()

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
  it("fills a long slot with the intro and the schedule", () => {
    const result = plan(290000, data, INTERMISSION_TIERS)

    expect(result.tierName).toBe("schedule")
    expect(result.segments.map((s) => s.spec.name)).toEqual([
      "intro",
      "schedule",
    ])
    expect(result.total).toBe(290000 - FADE_TRANSITION_MS)
  })

  it("gives the whole surplus to the schedule", () => {
    const short = plan(60000, data, INTERMISSION_TIERS)
    const long = plan(300000, data, INTERMISSION_TIERS)

    const durationOf = (result: typeof short, name: string) =>
      result.segments.find((s) => s.spec.name === name)?.duration

    expect(durationOf(long, "intro")).toBe(durationOf(short, "intro"))
    expect(durationOf(long, "schedule")).toBeGreaterThan(
      durationOf(short, "schedule") ?? 0,
    )
  })

  it("squeezes the schedule when the slot is far too short", () => {
    const result = plan(2000, data, INTERMISSION_TIERS)

    expect(result.tierName).toBe("schedule")
    expect(result.segments.every((s) => s.duration >= s.spec.min)).toBe(true)
    // Nothing thinner to fall back to while the sting is parked.
    expect(result.total).toBeGreaterThan(result.budget)
  })

  it("airs none of the parked views, at any length of slot", () => {
    for (const budget of [2000, 5000, 13000, 30000, 300000]) {
      const names = plan(budget, data, INTERMISSION_TIERS).segments.map(
        (s) => s.spec.name,
      )

      expect(names.some((name) => name.startsWith("news"))).toBe(false)
      expect(names).not.toContain("logo")
      expect(names).not.toContain("next")
      expect(names).not.toContain("slate")
    }
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

/*
 * The sting, the next-programme view and the news are written but held back
 * from air, so nothing in INTERMISSION_TIERS reaches them. They are composed
 * here instead: parked code that nothing exercises is parked code that quietly
 * stops being true, and these are meant to be switched on by uncommenting a
 * few lines rather than by being rewritten.
 */
describe("the parked tiers", () => {
  it("still plans a logo sting on its own", () => {
    const parked = [
      {
        name: "logo-only",
        build: () => [logoSting({ grow: 1, max: Infinity })],
      },
    ]

    const result = plan(6000, data, parked)

    expect(result.tierName).toBe("logo-only")
    expect(result.segments.map((s) => s.spec.name)).toEqual(["logo"])
  })

  it("still plans a sting followed by the next programme", () => {
    const parked = [
      {
        name: "logo-and-next",
        build: () => [logoSting(), nextProgram({ grow: 1, max: Infinity })],
      },
    ]

    expect(plan(20000, data, parked).segments.map((s) => s.spec.name)).toEqual([
      "logo",
      "next",
    ])
  })

  it("still plans one segment per bulletin, capped at three", () => {
    const many = planInputs({
      news: ["a", "b", "c", "d", "e"].map((id) => ({
        id,
        title: `Sak ${id}`,
        body: "Plassholdertekst.",
      })),
    })

    expect(newsPosters(many.news)).toHaveLength(3)
  })

  it("still composes the full intermission around the news", () => {
    const parked = [
      {
        name: "full",
        build: (inputs: typeof data) => [
          intro(),
          schedule({ grow: 1, max: Infinity }),
          ...newsPosters(inputs.news),
          orgSlate(),
        ],
      },
    ]

    const result = plan(90000, data, parked)

    expect(result.segments.map((s) => s.spec.name)).toEqual([
      "intro",
      "schedule",
      "news:en",
      "news:to",
      "news:tre",
      "slate",
    ])
    expect(result.total).toBe(90000 - FADE_TRANSITION_MS)
  })
})
