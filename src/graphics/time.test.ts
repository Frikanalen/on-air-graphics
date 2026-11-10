import { describe, it, expect } from "vitest"
import { parseTimestamp, formatTime, FPS, FRAME_MS } from "./time"
describe("one 50 fps Oslo clock", () => {
  it("pins the frame rate", () => {
    expect(FPS).toBe(50)
    expect(FRAME_MS).toBe(20)
  })
  it("parses Oslo local times without relying on the machine timezone", () => {
    expect(parseTimestamp("2026-11-10T19:07:00.212")).toBe(
      Date.parse("2026-11-10T18:07:00.212Z"),
    )
    expect(parseTimestamp("2026-06-10 19:07:00")).toBe(
      Date.parse("2026-06-10T17:07:00Z"),
    )
    expect(formatTime(Date.parse("2026-11-10T18:07:00Z"))).toBe("19:07")
  })
  it("rejects malformed and nonexistent dates and chooses the earlier fold", () => {
    for (const value of [
      "garbage",
      "2026-02-30T12:00:00",
      "2026-03-29T02:30:00",
    ])
      expect(() => parseTimestamp(value)).toThrow()
    expect(parseTimestamp("2026-10-25T02:30:00")).toBe(
      Date.parse("2026-10-25T00:30:00Z"),
    )
  })
})
