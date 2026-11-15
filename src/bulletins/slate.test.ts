import { describe, expect, it } from "vitest"
import { bulletin, planInputs } from "../sequencing/plan/fixtures"
import { INTERMISSION_TIERS, plan } from "../sequencing/plan/tiers"
import {
  SLATE_ENTRANCE_MS,
  TURN_MS,
  bulletinFromQuery,
  inTurn,
  slateMs,
  slatePageAt,
  slatePageMs,
  slatePages,
} from "./slate"

describe("a bulletin on the slate", () => {
  it("is given the time it takes to read every page once", () => {
    const two = bulletin()
    expect(slatePages(two)).toHaveLength(2)
    // 3 s a page, 0.4 s a word; the heading's three words count on the first.
    expect(slatePageMs(two)).toEqual([5800, 4600])
    expect(slateMs(two)).toBe(SLATE_ENTRANCE_MS + 5800 + 4600)
  })

  it("fades one page out before the next comes in", () => {
    const pageMs = [5000, 5000]
    const turn = SLATE_ENTRANCE_MS + 5000
    expect(slatePageAt(pageMs, 0)).toEqual({ index: 0, opacity: 1 })
    expect(slatePageAt(pageMs, turn - 150)).toEqual({ index: 0, opacity: 0.5 })
    expect(slatePageAt(pageMs, turn)).toEqual({ index: 1, opacity: 0 })
    expect(slatePageAt(pageMs, turn + 150)).toEqual({ index: 1, opacity: 0.5 })
    // The last page leaves with the slate, so it is never faded here.
    expect(slatePageAt(pageMs, turn + 60000)).toEqual({ index: 1, opacity: 1 })
  })

  it("airs the highest priority first and gives equals their turn", () => {
    const [a, b, urgent] = [
      bulletin({ id: 1 }),
      bulletin({ id: 2 }),
      bulletin({ id: 3, priority: 5 }),
    ]
    const ids = (now: number) => inTurn([a, b, urgent], now).map((x) => x.id)
    expect(ids(0)).toEqual([3, 1, 2])
    expect(ids(TURN_MS)).toEqual([3, 2, 1])
    expect(ids(2 * TURN_MS)).toEqual([3, 1, 2])
  })

  it("previews an unsaved bulletin from the address", () => {
    expect(bulletinFromQuery("?view=slate")).toBeNull()
    expect(
      bulletinFromQuery("?heading=Hei&text=En%0A%0ATo&template=notice"),
    ).toMatchObject({ heading: "Hei", text: "En\n\nTo", template: "notice" })
  })
})

describe("bulletins in a gap", () => {
  const names = (budget: number, count: number) =>
    plan(
      budget,
      planInputs({
        bulletins: Array.from({ length: count }, (_, id) => bulletin({ id })),
      }),
      INTERMISSION_TIERS,
    ).tierName

  it("airs as many whole bulletins as the gap has time for, at most three", () => {
    expect(names(20000, 5)).toBe("schedule")
    expect(names(40000, 5)).toBe("slate-and-schedule")
    expect(names(50000, 5)).toBe("2-slates-and-schedule")
    expect(names(600000, 5)).toBe("3-slates-and-schedule")
  })

  it("airs no more than there are", () => {
    expect(names(600000, 0)).toBe("schedule")
    expect(names(600000, 2)).toBe("2-slates-and-schedule")
  })
})
