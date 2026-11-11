import { describe, it, expect } from "vitest"
import {
  SECOND_KEYS,
  MINUTE_KEYS,
  recoil,
  flapAngle,
  clockModel,
} from "./model"
import { parseTimestamp } from "../time"

describe("mechanical station clock", () => {
  it.each(SECOND_KEYS)("second recoil at %i ms is %f degrees", (ms, angle) =>
    expect(recoil(SECOND_KEYS, ms)).toBeCloseTo(angle, 8),
  )
  it.each(MINUTE_KEYS)("minute recoil at %i ms is %f degrees", (ms, angle) =>
    expect(recoil(MINUTE_KEYS, ms)).toBeCloseTo(angle, 8),
  )
  const T = parseTimestamp("2026-11-10T19:07:00")
  it.each(MINUTE_KEYS)(
    "integrates minute and hour recoil at %i ms",
    (ms, angle) => {
      const model = clockModel(T + ms)
      expect(model.minute).toBeCloseTo(36 + angle, 8)
      expect(model.hour).toBeCloseTo(213 + angle / 12, 8)
    },
  )
  it("keeps minute and hour still between minute steps", () => {
    expect(clockModel(T + 310).minute).toBe(42)
    expect(clockModel(T + 59000).minute).toBe(42)
    expect(clockModel(T + 59000).hour).toBe(213.5)
  })
  it("matches the reference falling flap and rebounds", () => {
    expect(flapAngle(212)).toBeCloseTo(56, 0)
    expect(flapAngle(380)).toBe(180)
    expect(flapAngle(440)).toBe(172)
    expect(flapAngle(510)).toBe(180)
  })
  it("staggers changed digits right to left only", () => {
    const model = clockModel(parseTimestamp("2026-11-10T20:00:00.212"))
    expect(model.flaps.map((f) => f.old).join("")).toBe("1959")
    expect(model.flaps.map((f) => f.next).join("")).toBe("2000")
    expect(model.flaps.map((f) => f.delay)).toEqual([120, 80, 40, 0])
    expect(model.flaps.every((f) => f.changed)).toBe(true)
    expect(
      clockModel(T + 212)
        .flaps.filter((f) => f.changed)
        .map((f) => f.index),
    ).toEqual([3])
  })
  it("handles midnight and the Oslo DST fold", () => {
    const midnight = clockModel(parseTimestamp("2026-11-11T00:00:00"))
    expect(midnight.flaps.map((f) => f.old).join("")).toBe("2359")
    expect(midnight.flaps.map((f) => f.next).join("")).toBe("0000")
    expect(clockModel(parseTimestamp("2026-03-29T01:00:00.300Z")).hour).toBe(90)
    expect(clockModel(parseTimestamp("2026-10-25T01:00:00.300Z")).hour).toBe(60)
    const fold = clockModel(parseTimestamp("2026-10-25T01:00:00Z"))
    expect(fold.flaps.map((f) => f.old).join("")).toBe("0259")
    expect(fold.flaps.map((f) => f.next).join("")).toBe("0200")
  })
})
