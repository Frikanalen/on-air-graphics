import { describe, it, expect } from "vitest"
import { sceneAt } from "./scene"
import { plan as planGap, INTERMISSION_TIERS } from "../sequencing/plan/tiers"
import { type Plan } from "../sequencing/plan/types"
import {
  intro,
  schedule,
  orgSlate,
  newsPosters,
} from "../sequencing/plan/segments"
import { LIGHTS, RED } from "./sun"
import { parseTimestamp } from "./time"
const timestamp = parseTimestamp("2026-11-10T20:59:00")
const specs = [
  intro(),
  schedule(),
  newsPosters([{ id: "test", title: "Test", body: "Body" }])[0],
  orgSlate(),
]
const plan: Plan = {
  tierName: "test",
  budget: 40000,
  total: 40000,
  segments: specs.map((spec, i) => ({
    spec,
    start: i * 10000,
    duration: 10000,
  })),
}
describe("deterministic camera choreography", () => {
  it("uses the wide paper pose for intro and a smooth 1800ms push to the sheet", () => {
    expect(sceneAt(plan, 0, timestamp)).toMatchObject({
      tx: 250,
      ty: 264,
      scale: 3.25,
      clock: 0,
    })
    expect(sceneAt(plan, 10000, timestamp)).toMatchObject({
      sheet: 0,
      incoming: 0,
      clock: 0,
    })
    const half = sceneAt(plan, 10900, timestamp)
    expect(half.sheet).toBe(0.5)
    expect(half.scale).toBe((3.25 + 26) / 2)
    expect(sceneAt(plan, 11800, timestamp)).toMatchObject({
      sheet: 1,
      scale: 26,
      clock: 1,
      incoming: 1,
    })
  })
  it("moves directly from wide logo to schedule without an intermediate slate pose", () => {
    expect(sceneAt(plan, 8200, timestamp).scale).toBe(3.25)
    expect(sceneAt(plan, 9999.99, timestamp).scale).toBe(3.25)
    expect(sceneAt(plan, 10000, timestamp).scale).toBe(3.25)
    for (const budget of [16000, 30000, 60000, 81660]) {
      const gap = planGap(
        budget,
        { schedule: [], news: [] },
        INTERMISSION_TIERS,
      )
      expect(gap.segments.map((s) => s.spec.name)).toEqual([
        "intro",
        "schedule",
      ])
      for (let elapsed = 0; elapsed <= 5200; elapsed += 20) {
        const scene = sceneAt(gap, elapsed, timestamp)
        expect(scene.camera).not.toBe("close")
        if (elapsed < 3200) expect(scene.scale).toBe(3.25)
      }
      expect(sceneAt(gap, 5000, timestamp)).toMatchObject({
        sheet: 1,
        incoming: 1,
        clock: 1,
      })
    }
  })
  it("crossfades programme to red linearly over 800ms without blinking the clock", () => {
    expect(sceneAt(plan, 20000, timestamp).light).toEqual(LIGHTS[0])
    expect(sceneAt(plan, 20400, timestamp).light.tight).toBe(11.5)
    expect(sceneAt(plan, 20400, timestamp).blur).toBe(11.5)
    expect(sceneAt(plan, 20800, timestamp).light).toEqual(RED)
    expect(sceneAt(plan, 20000, timestamp).clock).toBe(1)
  })
  it("reverses the dolly for the closing slate and removes the clock over 300ms", () => {
    expect(sceneAt(plan, 30000, timestamp)).toMatchObject({
      sheet: 1,
      clock: 1,
    })
    expect(sceneAt(plan, 30300, timestamp).clock).toBe(0)
    expect(sceneAt(plan, 31800, timestamp)).toMatchObject({
      sheet: 0,
      scale: 13.4,
      tx: 668,
      ty: 22,
    })
  })
  it("shows the cream slate between the wide intro and the sheet in the shipped long-gap plan", () => {
    const gap = planGap(120000, { schedule: [], news: [] }, INTERMISSION_TIERS)
    expect(sceneAt(gap, 3199.99, timestamp).scale).toBe(3.25)
    expect(sceneAt(gap, 3200, timestamp)).toMatchObject({
      camera: "close",
      scale: 3.25,
      sheet: 0,
    })
    expect(sceneAt(gap, 5000, timestamp)).toMatchObject({
      camera: "close",
      scale: 13.4,
      sheet: 0,
      clock: 0,
      incoming: 0,
    })
    for (const elapsed of [3200, 4100, 4999.99])
      expect(sceneAt(gap, elapsed, timestamp).incoming).toBe(0)
    expect(sceneAt(gap, 5250, timestamp).incoming).toBe(0.5)
    expect(sceneAt(gap, 5500, timestamp).incoming).toBe(1)
    const scheduleStart = 3200 + orgSlate().min
    expect(sceneAt(gap, scheduleStart - 0.01, timestamp).scale).toBe(13.4)
    expect(sceneAt(gap, scheduleStart, timestamp)).toMatchObject({
      scale: 13.4,
      sheet: 0,
    })
    expect(sceneAt(gap, scheduleStart + 1800, timestamp)).toMatchObject({
      camera: "sheet",
      sheet: 1,
      clock: 1,
      incoming: 1,
    })
  })
  it("is independent of the order of sampling", () => {
    const a = sceneAt(plan, 11352, timestamp)
    sceneAt(plan, 33512, timestamp)
    sceneAt(plan, 3, timestamp)
    expect(sceneAt(plan, 11352, timestamp)).toEqual(a)
  })
})
