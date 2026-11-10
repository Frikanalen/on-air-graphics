import { test, expect, type Page } from "@playwright/test"
const items = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  starttime: `2026-11-10T${String(19 + i).padStart(2, "0")}:00:00+01:00`,
  endtime: `2026-11-10T${String(20 + i).padStart(2, "0")}:00:00+01:00`,
  video: {
    id: i,
    name: [
      "Mennesker og meninger",
      "Veien videre",
      "En samtale om byen",
      "Kultur fra hele landet",
      "Nye perspektiver",
    ][i],
    organization: { id: 1, name: "Medlemsorganisasjonen" },
  },
}))
async function prepare(
  page: Page,
  view: string,
  time: string,
  renderer = "dom",
) {
  await page.route("**/api/scheduleitems*", (route) =>
    route.fulfill({ json: { count: 5, results: items } }),
  )
  await page.route("**/api/playout/events", (route) =>
    route.fulfill({
      contentType: "text/event-stream",
      body: ": connected\n\n",
    }),
  )
  await page.goto(
    `/graphics/?view=${view}&t=2026-11-10T${time}&renderer=${renderer}`,
  )
  await page.locator(".scene").waitFor()
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map((img) => img.decode()))
    // CSS masks are not document.images. Wait for all the reusable mask assets.
    await Promise.all(
      [0, 1, 2].flatMap((i) =>
        [0, 12, 44, 108].map(
          (s) =>
            new Promise<void>((resolve, reject) => {
              const img = new Image()
              img.onload = () => resolve()
              img.onerror = reject
              img.src = `/graphics/scene/blade-${i}-${s}.png`
            }),
        ),
      ),
    )
  })
  await expect(page.locator(".player")).toHaveCSS("opacity", "1")
}
const stills = [
  ["1-camera1-flat-lit", "slate", "19:06:50"],
  ["2-schedule-stacked", "schedule", "19:06:50"],
  ["3-news-stacked", "news", "19:06:50"],
  ["day", "schedule", "12:10:50"],
  ["golden", "schedule", "15:20:50"],
  ["twilight", "schedule", "16:25:50"],
  ["night", "schedule", "20:59:50"],
  ["5-clock-detail", "schedule", "19:07:00.212"],
  ["intro", "intro", "19:06:50"],
  ["next", "next", "19:06:50"],
  ["poster", "poster", "19:06:50"],
]
for (const [name, view, time] of stills)
  test(name, async ({ page }, info) => {
    const errors: string[] = []
    page.on("pageerror", (e) => errors.push(e.message))
    await prepare(page, view, time)
    const frame = page.locator(".broadcast-frame")
    expect(await frame.boundingBox()).toEqual({
      x: 0,
      y: 0,
      width: 1280,
      height: 720,
    })
    const image = await frame.screenshot({
      path: info.outputPath(`${name}.png`),
    })
    expect(await frame.screenshot()).toEqual(image) // frozen input really is frozen
    if (["schedule", "next"].includes(view))
      await expect(page.locator(".next-row")).toBeVisible()
    await expect(page.locator(".station-clock")).toHaveCSS(
      "opacity",
      ["intro", "slate"].includes(view) ? "0" : "1",
    )
    expect(errors).toEqual([])
  })
test("1080p scales the entire opaque stage", async ({ page }, info) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await prepare(page, "schedule", "19:06:50")
  expect(await page.locator(".broadcast-frame").boundingBox()).toEqual({
    x: 0,
    y: 0,
    width: 1920,
    height: 1080,
  })
  const clock = await page.locator(".clock-canvas").boundingBox()
  expect(clock?.x).toBe(850 * 1.5)
  expect(clock?.width).toBe(352 * 1.5)
  await page.screenshot({ path: info.outputPath("schedule-1080.png") })
})

test("renderer probe reports software/hardware and timing data", async ({
  page,
}) => {
  await page.goto("/graphics/probe/index.html?seconds=1")
  await page.waitForFunction(() => "probeResult" in window)
  const report = await page.evaluate(
    () =>
      (
        window as unknown as {
          probeResult: {
            fps: number
            frames: number
            renderer: string
            frameInterval: { averageMs: number }
          }
        }
      ).probeResult,
  )
  expect(report.fps).toBe(50)
  expect(report.frames).toBeGreaterThan(1)
  expect(report.renderer.length).toBeGreaterThan(0)
  expect(report.frameInterval.averageMs).toBeGreaterThan(0)
})

for (const view of ["schedule", "slate"])
  test(`WebGL scene: ${view}`, async ({ page }, info) => {
    const errors: string[] = []
    page.on("pageerror", (e) => errors.push(e.message))
    await prepare(page, view, "19:06:50", "webgl")
    await expect(page.locator(".scene")).toHaveAttribute(
      "data-renderer",
      "webgl",
    )
    const frame = page.locator(".broadcast-frame")
    const first = await frame.screenshot({
      path: info.outputPath(`webgl-${view}.png`),
    })
    expect(await frame.screenshot()).toEqual(first)
    expect(errors).toEqual([])
  })

test("a frozen frame survives GPU context loss and restoration", async ({
  page,
}) => {
  await prepare(page, "schedule", "19:06:50", "webgl")
  await page.locator(".scene-canvas").evaluate((element) => {
    const extension = (element as HTMLCanvasElement)
      .getContext("webgl")!
      .getExtension("WEBGL_lose_context")!
    ;(
      window as unknown as { restoreTestContext: () => void }
    ).restoreTestContext = () => extension.restoreContext()
    extension.loseContext()
  })
  await expect(page.locator(".scene")).toHaveAttribute("data-renderer", "dom")
  await expect(page.locator(".scene-grain")).toHaveCSS("opacity", "0.07")
  await expect(page.locator(".blade-pose").last()).toHaveCSS("opacity", "1")
  await page.evaluate(() =>
    (
      window as unknown as { restoreTestContext: () => void }
    ).restoreTestContext(),
  )
  await expect(page.locator(".scene")).toHaveAttribute("data-renderer", "webgl")
})
