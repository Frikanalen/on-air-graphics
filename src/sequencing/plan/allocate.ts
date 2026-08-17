import { type Plan, type SegmentSpec } from "./types"

/** Guards against the rounding dust left by repeated proportional division. */
const EPS = 1e-6

const clamp = (value: number, lo: number, hi: number) =>
  Math.min(Math.max(value, lo), hi)

export const minDuration = (specs: SegmentSpec[]): number =>
  specs.reduce((total, spec) => total + spec.min, 0)

/**
 * Fit a tier's segments to a budget, the way a flex container fits its
 * children: start from what each one prefers, then either shrink toward the
 * minimums or hand out the surplus by weight.
 *
 * A budget below the sum of the minimums cannot be honoured. Every segment
 * lands on its minimum and the plan runs long; the caller is expected to have
 * chosen a poorer tier before it gets here, so an overrun means there was no
 * poorer tier to choose.
 */
export const allocate = (
  tierName: string,
  specs: SegmentSpec[],
  budgetMs: number,
): Plan => {
  /*
   * Slack has to have somewhere to go. Without an unbounded grower a generous
   * budget would leave the plan ending early and the last view holding a frame
   * it was never designed to hold, which is a tier authoring mistake rather
   * than a runtime condition -- so it fails loudly, in dev, on first render.
   */
  if (!specs.some((spec) => spec.grow > 0 && spec.max === Infinity))
    throw new Error(
      `Tier "${tierName}" needs a segment with grow > 0 and max: Infinity to absorb leftover time`,
    )

  const durations = specs.map((spec) => clamp(spec.basis, spec.min, spec.max))
  const sum = () => durations.reduce((total, d) => total + d, 0)

  if (sum() > budgetMs) {
    // Take the overage out of each segment in proportion to what it can spare,
    // so the tightest segments are not the ones asked to give the most.
    const room = specs.map((spec, i) => durations[i] - spec.min)
    const roomTotal = room.reduce((total, r) => total + r, 0)
    const excess = Math.min(sum() - budgetMs, roomTotal)

    if (roomTotal > 0)
      specs.forEach((_, i) => {
        durations[i] -= (excess * room[i]) / roomTotal
      })
  } else {
    /*
     * Hand out the surplus by grow weight. A segment that hits its max is
     * frozen there and its unused share goes back into the pot for the next
     * pass, so capped segments never swallow time they cannot use.
     */
    let leftover = budgetMs - sum()
    let active = specs
      .map((_, i) => i)
      .filter((i) => specs[i].grow > 0 && specs[i].max > durations[i])

    while (leftover > EPS && active.length > 0) {
      const growTotal = active.reduce((total, i) => total + specs[i].grow, 0)
      const next: number[] = []
      let distributed = 0

      for (const i of active) {
        const share = (leftover * specs[i].grow) / growTotal
        const headroom = specs[i].max - durations[i]
        const added = Math.min(share, headroom)

        durations[i] += added
        distributed += added

        if (headroom - added > EPS) next.push(i)
      }

      leftover -= distributed
      active = next

      // Nothing moved, so nothing will on the next pass either.
      if (distributed <= EPS) break
    }
  }

  /*
   * Round the cumulative boundaries rather than the individual durations, so
   * the segments tile the timeline exactly: no half-millisecond seams for the
   * playhead to land in and no drift accumulating across a long plan.
   */
  const bounds = [0]
  let elapsed = 0

  for (const duration of durations) {
    elapsed += duration
    bounds.push(Math.round(elapsed))
  }

  const segments = specs.map((spec, i) => ({
    spec,
    start: bounds[i],
    duration: bounds[i + 1] - bounds[i],
  }))

  return {
    tierName,
    budget: budgetMs,
    total: bounds[bounds.length - 1],
    segments,
  }
}
