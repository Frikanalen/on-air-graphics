import { type SegmentSpec, type TimelineTier } from "./types"

/*
 * Synthetic segments and tiers for the tests. The real ones carry tuning that
 * is meant to be changed freely, so asserting against them would turn every
 * retune into a test failure; these keep the arithmetic under test explicit.
 */

export const segment = (
  name: string,
  overrides: Partial<SegmentSpec> = {},
): SegmentSpec => ({
  name,
  min: 0,
  basis: 0,
  max: Infinity,
  grow: 0,
  // No animation unless a test is about one, so timings stay out of the way of
  // the arithmetic.
  enter: 0,
  exit: 0,
  render: () => null,
  ...overrides,
})

/** A tier that costs exactly `min` and can absorb any surplus. */
export const tier = (name: string, min: number): TimelineTier => ({
  name,
  build: () => [segment(name, { min, basis: min, grow: 1 })],
})
