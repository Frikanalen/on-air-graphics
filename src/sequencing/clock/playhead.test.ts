import { afterEach, describe, it, expect, vi } from "vitest"
import { createPlayhead } from "./playhead"
import { frameClock } from "../../graphics/time"
afterEach(() => vi.restoreAllMocks())
describe("shared 50 fps playhead", () => {
  it("starts at zero when the frame clock wakes after a long preload", () => {
    let now = 100000
    vi.spyOn(frameClock, "now").mockImplementation(() => now)
    vi.spyOn(frameClock, "subscribe").mockImplementation(() => {
      now = 105000
      return () => {}
    })
    const p = createPlayhead()
    p.restart()
    expect(p.now()).toBe(0)
    now += 20
    expect(p.now()).toBe(20)
    p.pause()
  })
  it("anchors restart/pause/seek/resume to the injected time and cleans up subscriptions", () => {
    let now = 100000,
      notify: () => void = () => {}
    const stop = vi.fn()
    vi.spyOn(frameClock, "now").mockImplementation(() => now)
    const subscribe = vi
      .spyOn(frameClock, "subscribe")
      .mockImplementation((fn) => {
        notify = fn
        return stop
      })
    const p = createPlayhead(),
      listener = vi.fn()
    const off = p.subscribe(listener)
    p.restart()
    expect(p.now()).toBe(0)
    now += 20
    notify()
    expect(p.now()).toBe(20)
    p.pause()
    now += 200
    expect(p.now()).toBe(20)
    p.seek(212)
    expect(p.now()).toBe(212)
    p.resume()
    now += 20
    expect(p.now()).toBe(232)
    off()
    expect(stop).toHaveBeenCalledTimes(2)
    const off2 = p.subscribe(listener)
    expect(subscribe).toHaveBeenCalledTimes(3)
    off2()
  })
})
