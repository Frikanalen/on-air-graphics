import { describe, it, expect } from "vitest"
import { sunElevation, lightAtElevation, LIGHTS } from "./sun"
import { parseTimestamp } from "./time"
import { mixColor, rgb } from "./color"
describe("Oslo sun and lighting", () => {
  it.each([
    ["12:10", 12.9],
    ["15:20", 3],
    ["16:25", -3.6],
    ["20:59", -36.4],
  ])("elevation at %s is approximately %f", (time, expected) => {
    expect(
      Math.abs(
        sunElevation(parseTimestamp(`2026-11-10T${time}:00`)) -
          Number(expected),
      ),
    ).toBeLessThan(0.2)
  })
  it.each([-8, -3.5, 3, 12])("matches key state at %f degrees", (elevation) =>
    expect(lightAtElevation(elevation)).toEqual(
      LIGHTS[[-8, -3.5, 3, 12].indexOf(elevation)],
    ),
  )
  it("clamps the endpoints and interpolates numeric properties", () => {
    expect(lightAtElevation(-90)).toEqual(LIGHTS[0])
    expect(lightAtElevation(90)).toEqual(LIGHTS[3])
    expect(lightAtElevation(-5.75).scale).toBe(28)
    expect(mixColor("#000000", "#ffffff", 0.5)).toBe("#636363")
  })
  it("keeps paper text above 4.5:1 across the full ramp", () => {
    const lum = (c: string) => {
      const [r, g, b] = rgb(c).map((v) =>
        v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
      )
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
    for (let e = -8; e <= 12; e += 0.1)
      expect(
        (lum("#F5EFE4") + 0.05) / (lum(lightAtElevation(e).stops[0]) + 0.05),
      ).toBeGreaterThanOrEqual(4.5)
  })
})
