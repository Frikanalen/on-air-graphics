import { afterEach, describe, it, expect, vi } from "vitest"
import { frameClock } from "./time"
afterEach(() => {
  vi.unstubAllGlobals()
})
describe("50 fps presentation cadence", () => {
  function harness() {
    let callback: FrameRequestCallback = () => {}
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((fn) => {
        callback = fn
        return 1
      }),
    )
    const cancel = vi.fn()
    vi.stubGlobal("cancelAnimationFrame", cancel)
    const notify = vi.fn(),
      off = frameClock.subscribe(notify)
    return { tick: (t: number) => callback(t), notify, off, cancel }
  }
  it("presents every CEF frame despite small RAF jitter", () => {
    const h = harness()
    for (const time of [0, 20, 39.2, 60.6, 79.7, 100.1]) h.tick(time)
    expect(h.notify).toHaveBeenCalledTimes(6)
    h.off()
    expect(h.cancel).toHaveBeenCalled()
  })
  it("limits a 60 Hz desktop preview to 50 updates per second", () => {
    const h = harness()
    for (let i = 0; i <= 60; i++) h.tick((i * 1000) / 60)
    expect(h.notify).toHaveBeenCalledTimes(51) // first frame, then 50 intervals
    h.off()
  })
})
