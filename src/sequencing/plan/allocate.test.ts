import { describe, expect, it } from "vitest"
import { allocate, minDuration } from "./allocate"
import { segment as spec } from "./fixtures"
import { type SegmentSpec } from "./types"

/** Segment durations keyed by name, for readable assertions. */
const durations = (specs: SegmentSpec[], budget: number) =>
  Object.fromEntries(
    allocate("test", specs, budget).segments.map((s) => [
      s.spec.name,
      s.duration,
    ]),
  )

const elastic = spec("elastic", { grow: 1 })

describe("minDuration", () => {
  it("sums the minimums", () => {
    expect(
      minDuration([spec("a", { min: 3000 }), spec("b", { min: 12000 })]),
    ).toBe(15000)
  })
})

describe("allocate", () => {
  it("refuses a tier with nowhere to put leftover time", () => {
    expect(() => allocate("rigid", [spec("a", { basis: 1000 })], 5000)).toThrow(
      /leftover time/,
    )
  })

  it("leaves a rigid segment at its basis and gives the rest away", () => {
    expect(
      durations(
        [spec("intro", { min: 3200, basis: 3200, max: 3200 }), elastic],
        20000,
      ),
    ).toEqual({ intro: 3200, elastic: 16800 })
  })

  it("splits leftover time by grow weight", () => {
    expect(
      durations(
        [
          spec("a", { basis: 1000, grow: 1 }),
          spec("b", { basis: 1000, grow: 3 }),
        ],
        10000,
      ),
    ).toEqual({ a: 3000, b: 7000 })
  })

  it("redistributes to the remaining growers when one hits its max", () => {
    // a can take only 1000 more; the other 7000 has to land on b.
    expect(
      durations(
        [
          spec("a", { basis: 1000, max: 2000, grow: 1 }),
          spec("b", { basis: 1000, grow: 1 }),
        ],
        10000,
      ),
    ).toEqual({ a: 2000, b: 8000 })
  })

  it("shrinks toward the minimums in proportion to what each can spare", () => {
    // Both can spare 2000 of the 2000 overage, so both give up 1000.
    expect(
      durations(
        [
          spec("a", { min: 1000, basis: 3000 }),
          spec("b", { min: 2000, basis: 4000, grow: 1 }),
        ],
        5000,
      ),
    ).toEqual({ a: 2000, b: 3000 })
  })

  it("overruns rather than going below the minimums", () => {
    const plan = allocate(
      "squeezed",
      [
        spec("a", { min: 3000, basis: 3000 }),
        spec("b", { min: 2000, basis: 2000, grow: 1 }),
      ],
      1000,
    )

    expect(plan.budget).toBe(1000)
    expect(plan.total).toBe(5000)
    expect(plan.segments.map((s) => s.duration)).toEqual([3000, 2000])
  })

  it("tiles the timeline exactly when the split does not divide evenly", () => {
    const plan = allocate(
      "thirds",
      [spec("a", { grow: 1 }), spec("b", { grow: 1 }), spec("c", { grow: 1 })],
      10000,
    )

    expect(plan.total).toBe(10000)
    expect(plan.segments.map((s) => s.duration)).toEqual([3333, 3334, 3333])

    // No gaps and no overlaps: each segment starts where the last one ended.
    plan.segments.forEach((segment, i) => {
      const previous = plan.segments[i - 1]
      expect(segment.start).toBe(
        previous ? previous.start + previous.duration : 0,
      )
    })

    expect(plan.segments.reduce((sum, s) => sum + s.duration, 0)).toBe(
      plan.total,
    )
  })

  it("keeps a segment already at its max out of the split", () => {
    expect(
      durations(
        [
          spec("capped", { basis: 2000, max: 2000, grow: 1 }),
          spec("open", { basis: 1000, grow: 1 }),
        ],
        10000,
      ),
    ).toEqual({ capped: 2000, open: 8000 })
  })
})
