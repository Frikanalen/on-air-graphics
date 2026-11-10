// Run once after changing the logo geometry. ImageMagick 7 and Playwright Chromium are required.
// Assets are authored at 1080p (1.5 px/du), at the largest 30x blade pose.
import { readFileSync, mkdirSync, writeFileSync, unlinkSync } from "node:fs"
import { execFileSync } from "node:child_process"
import { chromium } from "playwright"
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 2475, height: 2790 } })
const logo = readFileSync("src/core/components/Logo.tsx", "utf8")
const paths = [...logo.matchAll(/d="(M[^"]+)"/g)].slice(0, 3).map((m) => m[1])
mkdirSync("public/scene", { recursive: true })
const gradients = [
  '<linearGradient id="g" x1="7.8" y1="-2.34" x2="36.75" y2="14.38" gradientUnits="userSpaceOnUse"><stop offset=".09" stop-color="#f1583d"/><stop offset=".55" stop-color="#be4628"/><stop offset="1" stop-color="#6a2844"/></linearGradient>',
  '<linearGradient id="g" x1="11.63" y1="29.76" x2="35.23" y2="9.95" gradientUnits="userSpaceOnUse"><stop stop-color="#d2683c"/><stop offset=".5" stop-color="#eda832"/><stop offset="1" stop-color="#ffc81c"/></linearGradient>',
  '<linearGradient id="g" x1="11.74" y1="45.13" x2="20.69" y2="29.62" gradientUnits="userSpaceOnUse"><stop offset=".1" stop-color="#64c046"/><stop offset=".6" stop-color="#4e9769"/><stop offset="1" stop-color="#2f5d4e"/></linearGradient>',
]
// Use the exact per-channel two-light calculation, including intermediate stops.
const flats = [
  [241, 86, 69],
  [251, 174, 56],
  [100, 188, 80],
]
const light = (i, t) =>
  "#" +
  flats[i]
    .map((v, j) =>
      Math.round(
        Math.min(
          255,
          v * ([1, 1.02, 0.88][j] * t + [0.44, 0.47, 0.98][j] * (1 - t)),
        ),
      )
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")
for (let i = 0; i < 3; i++) {
  const stops =
    i === 0
      ? [
          [0.09, 1],
          [0.55, 0.62],
          [1, 0],
        ]
      : i === 1
        ? [[0.5, 0.9]]
        : [
            [0.1, 1],
            [0.6, 0.6],
            [1, 0.05],
          ]
  const gradient = gradients[i].replace(
    /<stop.*<\/linearGradient>/,
    (i === 1 ? '<stop stop-color="#D2683C"/>' : "") +
      stops
        .map(
          ([offset, t]) =>
            `<stop offset="${offset}" stop-color="${light(i, t)}"/>`,
        )
        .join("") +
      (i === 1 ? '<stop offset="1" stop-color="#FFC81C"/>' : "") +
      "</linearGradient>",
  )
  for (const kind of ["lit", "mask"]) {
    const file = `public/scene/blade-${i}-${kind}.svg`
    writeFileSync(
      file,
      `<svg xmlns="http://www.w3.org/2000/svg" width="2475" height="2790" viewBox="-5 -5 55 62"><defs>${gradient}</defs><path d="${paths[i]}" fill="${kind === "lit" ? "url(#g)" : "white"}"/></svg>`,
    )
    if (kind === "lit") continue
    // Chromium uses the same SVG path rasteriser as the HTML producer. This
    // avoids the faceted curve flattening in ImageMagick's built-in SVG reader.
    await page.setContent(readFileSync(file, "utf8"))
    const base = `public/scene/blade-${i}-0.png`
    await page.locator("svg").screenshot({ path: base, omitBackground: true })
    for (const sigma of [12, 44, 108])
      execFileSync("magick", [
        base,
        "-channel",
        "RGBA",
        "-blur",
        `0x${sigma * 1.5}`,
        `public/scene/blade-${i}-${sigma}.png`,
      ])
    unlinkSync(file)
  }
}
// Rasterise the fixed SVG fractal once. No live full-frame noise filter.
await page.setViewportSize({ width: 256, height: 144 })
await page.setContent(
  `<style>body{margin:0}</style><svg xmlns="http://www.w3.org/2000/svg" width="256" height="144"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="23" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feColorMatrix type="luminanceToAlpha" result="mask"/><feFlood flood-color="white"/><feComposite in2="mask" operator="in"/></filter><rect width="256" height="144" filter="url(#grain)"/></svg>`,
)
await page
  .locator("svg")
  .screenshot({ path: "public/scene/grain.png", omitBackground: true })
await browser.close()
