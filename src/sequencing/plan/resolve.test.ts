import { describe, expect, it } from "vitest"
import { allocate } from "./allocate"
import { FADE_TRANSITION_MS } from "../../core/constants"
import { segment } from "./fixtures"
import { resolve } from "./resolve"

// Three 10s segments, so every boundary sits on a round number.
const plan = allocate(
  "test",
  [
    segment("first", { min: 10000, basis: 10000, max: 10000 }),
    segment("second", { min: 10000, basis: 10000, max: 10000 }),
    segment("third", { grow: 1 }),
  ],
  30000,
)

const at = (t: number) => resolve(plan, t)

describe("resolve", () => {
  it("finds the segment covering the instant", () => {
    expect(at(0).spec.name).toBe("first")
    expect(at(9999).spec.name).toBe("first")
    expect(at(10000).spec.name).toBe("second")
    expect(at(20000).spec.name).toBe("third")
  })

  it("reports time relative to the segment, not the plan", () => {
    expect(at(12500).time.t).toBe(2500)
    expect(at(12500).time.duration).toBe(10000)
    expect(at(12500).index).toBe(1)
  })

  it("enters for the length of the fade", () => {
    expect(at(0).time.status).toBe("entering")
    expect(at(FADE_TRANSITION_MS - 1).time.status).toBe("entering")
    expect(at(FADE_TRANSITION_MS).time.status).toBe("entered")
  })

  it("exits over the fade before a handover", () => {
    expect(at(10000 - FADE_TRANSITION_MS - 1).time.status).toBe("entered")
    expect(at(10000 - FADE_TRANSITION_MS).time.status).toBe("exiting")
    expect(at(9999).time.status).toBe("exiting")
  })

  it("never exits the last segment", () => {
    expect(at(29999).time.status).toBe("entered")
    expect(at(29999).spec.name).toBe("third")
  })

  it("holds the last segment past the end of the plan", () => {
    const late = at(plan.total + 600000)

    expect(late.spec.name).toBe("third")
    expect(late.time.status).toBe("entered")
    expect(late.index).toBe(2)
  })

  it("clamps a negative playhead to the start", () => {
    expect(at(-5000).index).toBe(0)
    expect(at(-5000).time.t).toBe(0)
  })

  it("covers every instant of the plan without a gap", () => {
    for (let t = 0; t < plan.total; t += 137) {
      const active = resolve(plan, t)
      const planned = plan.segments[active.index]

      expect(active.time.t).toBeGreaterThanOrEqual(0)
      expect(active.time.t).toBeLessThan(planned.duration)
      expect(planned.start + active.time.t).toBe(t)
    }
  })
})
