import { test, expect, type Page } from "@playwright/test"
const items = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  starttime: `2026-11-10T${String(19 + i).padStart(2, "0")}:00:00+01:00`,
  endtime: `2026-11-10T${String(20 + i).padStart(2, "0")}:00:00+01:00`,
  video: {
    id: i,
    name: [
      "Mennesker og meninger – en samtale om lokaldemokrati, kultur og frivillighet",
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
    if (view === "next") {
      const title = page.locator(".next-row h2")
      const size = await title.evaluate((el) => ({
        height: el.clientHeight,
        contentHeight: el.scrollHeight,
        width: el.clientWidth,
      }))
      expect(size.width).toBeGreaterThan(440)
      expect(size.height).toBeGreaterThan(50)
      expect(size.contentHeight).toBeLessThanOrEqual(size.height + 1)
    }
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

test("no duration opens the dev menu and a 60-second gap includes the cream slate", async ({
  page,
}, info) => {
  await prepare(page, "slate", "19:06:50")
  await page.goto("/graphics/?renderer=dom&t=2026-11-10T19:06:50")
  await expect(
    page.getByRole("button", { name: "PLAY", exact: true }),
  ).toBeVisible()
  await expect(page.locator('aside input[type="number"]')).toBeVisible()
  await page.locator('aside input[type="number"]').fill("60")
  await page.getByRole("button", { name: "PLAY", exact: true }).click()
  const advance = page.getByRole("button", { name: "+½s", exact: true })
  for (let i = 0; i < 9; i++) await advance.click()
  const slateLayer = page.locator(".view-layer").filter({ has: page.locator(".org-slate") })
  await expect(slateLayer).toHaveCSS("opacity", "0")
  for (let i = 0; i < 2; i++) await advance.click()
  await expect(slateLayer).toHaveCSS("opacity", "1")
  await expect(
    page.getByRole("heading", { name: "Dette er Frikanalen", exact: true }),
  ).toBeVisible()
  await expect(page.locator(".station-clock")).toHaveCSS("opacity", "0")
  await page
    .locator(".broadcast-frame")
    .screenshot({ path: info.outputPath("60-second-gap-slate.png") })
  for (let i = 0; i < 13; i++) await advance.click()
  await expect(page.locator(".schedule-column .label").first()).toHaveText(
    "Neste program",
  )
  await expect(page.locator(".station-clock")).toHaveCSS("opacity", "1")
})

test("loading time does not consume the opening scene", async ({ page }) => {
  const initial = new Date("2026-11-10T18:06:50Z")
  await page.clock.install({ time: initial })
  await page.clock.pauseAt(new Date(+initial + 1000))
  let release!: () => void
  const response = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route("**/api/scheduleitems*", async (route) => {
    await response
    await route.fulfill({ json: { count: 5, results: items } })
  })
  await page.route("**/api/playout/events", (route) =>
    route.fulfill({
      contentType: "text/event-stream",
      body: ": connected\n\n",
    }),
  )
  await page.goto("/graphics/?renderer=dom")
  await expect(page.getByText("Loading...", { exact: true })).toBeVisible()
  await page.clock.fastForward(5000)
  release()
  await expect(page.locator(".broadcast-frame")).toBeVisible()
  await page.clock.runFor(600)
  await expect(page.locator('.view-layer[data-segment="0"]')).toHaveCSS(
    "opacity",
    "1",
  )
  await expect(page.locator(".wide-wordmark")).toBeVisible()
  await expect(page.locator(".org-slate")).toHaveCount(0)
})

for (const width of [1280, 1920])
  test(`clock key has no rectangular footprint at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: (width * 9) / 16 })
    await prepare(page, "news", "19:06:50")
    await page.evaluate(() => {
      const clock = document.querySelector<HTMLCanvasElement>(".clock-canvas")!
      const fixture = document.createElement("div")
      fixture.id = "clock-key-fixture"
      fixture.style.cssText =
        "position:fixed;left:0;top:0;width:352px;height:446px;background:rgb(72,103,149);z-index:99999"
      fixture.style.transform = `scale(${window.innerWidth / 1280})`
      fixture.style.transformOrigin = "top left"
      const capture = document.createElement("canvas")
      capture.width = clock.width
      capture.height = clock.height
      capture.style.cssText = `position:absolute;inset:0;width:352px;height:446px;filter:${clock.style.filter}`
      const context = capture.getContext("2d")!
      context.fillStyle = "black"
      context.fillRect(0, 0, capture.width, capture.height)
      fixture.append(capture)
      document.body.append(fixture)
    })
    const fixture = page.locator("#clock-key-fixture")
    const keyed = await fixture.screenshot()
    await fixture.locator("canvas").evaluate((canvas) => {
      canvas.style.visibility = "hidden"
    })
    const background = await fixture.screenshot()
    expect(
      keyed.equals(background),
      "black must key out at every pixel, without a rectangular footprint",
    ).toBe(true)
    await fixture.locator("canvas").evaluate((canvas) => {
      canvas.style.visibility = "visible"
      canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height)
    })
    expect(
      (await fixture.screenshot()).equals(background),
      "an empty capture must also be transparent",
    ).toBe(true)
    await fixture.locator("canvas").evaluate((canvas) => {
      const context = canvas.getContext("2d")!
      context.fillStyle = "white"
      context.fillRect(160, 200, 32, 32)
    })
    expect(
      (await fixture.screenshot()).equals(background),
      "white clock details must remain visible",
    ).toBe(false)
  })
