import { describe, expect, it } from "vitest"
import {
  cyclePages,
  heldSchedulePage,
  schedulePageAt,
  type SchedulePageKind,
} from "./cycle"

const full: SchedulePageKind[] = ["overview", "list", "list", "focus"]

describe("cyclePages", () => {
  it("holds the overview when there is no time to turn pages", () => {
    expect(cyclePages(full, 20000)).toEqual([0])
  })
  it("shows the overview and the next programme first", () => {
    expect(cyclePages(full, 22000)).toEqual([0, 3])
  })
  it("adds pages of the later schedule as time allows", () => {
    expect(cyclePages(full, 31000)).toEqual([0, 1, 3])
    expect(cyclePages(full, 40000)).toEqual([0, 1, 2, 3])
  })
  it("holds the only page there is", () => {
    expect(cyclePages(["focus"], 600000)).toEqual([0])
    expect(cyclePages(["overview"], 600000)).toEqual([0])
    expect(cyclePages([], 600000)).toEqual([])
  })
})

describe("schedulePageAt", () => {
  it("starts on the overview and ends on the next programme", () => {
    for (const duration of [22000, 45000, 60000, 119500, 1800000]) {
      expect(schedulePageAt(full, duration, 0)).toEqual({
        index: 0,
        opacity: 1,
      })
      expect(schedulePageAt(full, duration, duration - 1)).toEqual({
        index: 3,
        opacity: 1,
      })
      expect(schedulePageAt(full, duration, duration + 5000).index).toBe(3)
    }
  })
  it("stretches one cycle to fill the time", () => {
    // 40 s of pages in 60 s: every page is held half as long again.
    expect(schedulePageAt(full, 60000, 17000).index).toBe(0)
    expect(schedulePageAt(full, 60000, 19000).index).toBe(1)
    expect(schedulePageAt(full, 60000, 32000).index).toBe(2)
    expect(schedulePageAt(full, 60000, 46000).index).toBe(3)
  })
  it("goes round in whole cycles", () => {
    // Two cycles of 40 s in 80 s.
    expect(schedulePageAt(full, 80000, 39000).index).toBe(3)
    expect(schedulePageAt(full, 80000, 41000).index).toBe(0)
    expect(schedulePageAt(full, 80000, 79000).index).toBe(3)
  })
  it("fades one page out before the next fades in", () => {
    expect(schedulePageAt(full, 40000, 11850)).toEqual({
      index: 0,
      opacity: 0.5,
    })
    expect(schedulePageAt(full, 40000, 12000)).toEqual({
      index: 1,
      opacity: 0,
    })
    expect(schedulePageAt(full, 40000, 12150)).toEqual({
      index: 1,
      opacity: 0.5,
    })
    expect(schedulePageAt(full, 40000, 15000).opacity).toBe(1)
  })
  it("fades between cycles too", () => {
    expect(schedulePageAt(full, 80000, 39850).opacity).toBe(0.5)
    expect(schedulePageAt(full, 80000, 40150)).toEqual({
      index: 0,
      opacity: 0.5,
    })
  })
})

describe("heldSchedulePage", () => {
  it("takes a kind or an index", () => {
    expect(heldSchedulePage(full, "?page=focus")).toBe(3)
    expect(heldSchedulePage(full, "?page=2")).toBe(2)
    expect(heldSchedulePage(full, "?page=9")).toBeNull()
    expect(heldSchedulePage(full, "")).toBeNull()
  })
})

describe("a handover page", () => {
  const kinds: SchedulePageKind[] = [...full, "handover"]
  it("takes the place of the last page of the gap, and only that one", () => {
    for (const duration of [22000, 45000, 119500, 1800000]) {
      expect(schedulePageAt(kinds, duration, duration - 1)).toEqual({
        index: 4,
        opacity: 1,
      })
      expect(schedulePageAt(kinds, duration, 0).index).toBe(0)
    }
    // Two cycles: the first still ends on the focus.
    expect(schedulePageAt(kinds, 80000, 39000).index).toBe(3)
    expect(schedulePageAt(kinds, 80000, 79000).index).toBe(4)
  })
  it("is held throughout a gap too short to turn pages", () => {
    expect(schedulePageAt(kinds, 15000, 0)).toEqual({ index: 4, opacity: 1 })
    expect(schedulePageAt(kinds, 15000, 14000).index).toBe(4)
  })
  it("can be held by name", () => {
    expect(heldSchedulePage(kinds, "?page=handover")).toBe(4)
  })
})
