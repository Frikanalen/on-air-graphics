import { describe, expect, it } from "vitest"
import {
  MEMBER_ENTRANCE_MS,
  MEMBER_MESSAGE_MS,
  MEMBER_PAGES,
  memberPageAt,
} from "./memberMessage"
import { plan, INTERMISSION_TIERS } from "../sequencing/plan/tiers"
describe("member message reading time", () => {
  it("keeps every paragraph for its full reading interval, including after scrubbing backwards", () => {
    let start = MEMBER_ENTRANCE_MS
    for (const [index, page] of MEMBER_PAGES.entries()) {
      expect(page.duration % 20).toBe(0)
      expect(memberPageAt(start)).toBe(index)
      expect(memberPageAt(start + page.duration - 1)).toBe(index)
      start += page.duration
    }
    expect(start).toBe(MEMBER_MESSAGE_MS)
    expect(memberPageAt(start + 1000)).toBe(3)
    expect(memberPageAt(0)).toBe(0)
  })
  it("skips the complete message in a short gap rather than truncating it", () => {
    const data = { schedule: [], news: [] }
    expect(
      plan(60000, data, INTERMISSION_TIERS).segments.map((s) => s.spec.name),
    ).toEqual(["intro", "schedule"])
    const long = plan(120000, data, INTERMISSION_TIERS)
    expect(long.segments.find((s) => s.spec.name === "slate")?.duration).toBe(
      MEMBER_MESSAGE_MS,
    )
    expect(long.total + 500).toBe(120000)
  })
})
