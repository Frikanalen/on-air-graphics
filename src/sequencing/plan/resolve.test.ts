import { describe, expect, it } from "vitest"
import { allocate } from "./allocate"
import { planInputs, segment } from "./fixtures"
import { activeSegment, resolve } from "./resolve"
import { INTERMISSION_TIERS, POSTER_TIERS } from "./tiers"

const fixed = (name: string, ms: number, animation: number) =>
  segment(name, {
    min: ms,
    basis: ms,
    max: ms,
    enter: animation,
    exit: animation,
  })

// Three 10s segments that each take 1s to animate in and 1s to animate out.
const plan = allocate(
  "test",
  [
    fixed("first", 10000, 1000),
    fixed("second", 10000, 1000),
    segment("third", { grow: 1, enter: 1000, exit: 1000 }),
  ],
  30000,
)

const names = (t: number) => resolve(plan, t).map((r) => r.spec.name)
const statuses = (t: number) => resolve(plan, t).map((r) => r.time.status)
const active = (t: number) => activeSegment(plan, t)

describe("resolve", () => {
  it("shows one view in the middle of a segment", () => {
    expect(names(5000)).toEqual(["first"])
    expect(statuses(5000)).toEqual(["entered"])
  })

  it("finds the segment that owns the instant", () => {
    expect(active(0).spec.name).toBe("first")
    expect(active(9999).spec.name).toBe("first")
    expect(active(10000).spec.name).toBe("second")
    expect(active(20000).spec.name).toBe("third")
  })

  it("holds the entering status for the length of the entrance", () => {
    expect(active(0).time.status).toBe("entering")
    expect(active(999).time.status).toBe("entering")
    expect(active(1000).time.status).toBe("entered")
  })

  it("keeps the outgoing view on screen over the start of the next one", () => {
    // The handover is at 10000; "first" has 1000ms of exit left to play.
    expect(names(10000)).toEqual(["first", "second"])
    expect(statuses(10000)).toEqual(["exiting", "entering"])

    expect(names(10999)).toEqual(["first", "second"])
    expect(names(11000)).toEqual(["second"])
  })

  it("measures the outgoing view from the moment its exit began", () => {
    const [outgoing] = resolve(plan, 10400)

    expect(outgoing.spec.name).toBe("first")
    expect(outgoing.time.t).toBe(400)
    expect(outgoing.time.duration).toBe(1000)
  })

  it("orders the outgoing view behind the incoming one", () => {
    expect(resolve(plan, 10100).map((r) => r.index)).toEqual([0, 1])
  })

  it("reports time relative to the segment, not the plan", () => {
    expect(active(12500).time.t).toBe(2500)
    expect(active(12500).time.duration).toBe(10000)
    expect(active(12500).index).toBe(1)
  })

  it("never exits the last segment", () => {
    expect(names(29999)).toEqual(["third"])
    expect(statuses(29999)).toEqual(["entered"])
  })

  it("holds the last segment past the end of the plan", () => {
    const late = active(plan.total + 600000)

    expect(late.spec.name).toBe("third")
    expect(late.time.status).toBe("entered")
    expect(late.index).toBe(2)
  })

  it("clamps a negative playhead to the start", () => {
    expect(active(-5000).index).toBe(0)
    expect(active(-5000).time.t).toBe(0)
  })

  it("always has exactly one view that owns the instant", () => {
    for (let t = 0; t < plan.total; t += 137) {
      const rendered = resolve(plan, t)
      const owners = rendered.filter((r) => r.time.status !== "exiting")

      expect(owners).toHaveLength(1)
      expect(rendered.length).toBeLessThanOrEqual(2)

      const owner = rendered[rendered.length - 1]
      const planned = plan.segments[owner.index]

      expect(owner.time.t).toBeGreaterThanOrEqual(0)
      expect(owner.time.t).toBeLessThan(planned.duration)
      expect(planned.start + owner.time.t).toBe(t)
    }
  })
})

describe("the shipped segments", () => {
  const data = planInputs()

  it("gives every view time to finish arriving before it hands over", () => {
    for (const tiers of [INTERMISSION_TIERS, POSTER_TIERS])
      for (const tier of tiers)
        for (const spec of tier.build(data)) {
          expect(spec.enter).toBeLessThanOrEqual(spec.min)
          expect(spec.exit).toBeLessThanOrEqual(spec.min)
        }
  })
})
