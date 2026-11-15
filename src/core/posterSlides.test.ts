import { describe, expect, it } from "vitest"
import cases from "./paging-cases.json"
import {
  PAGE_LENGTH,
  posterMinimumSeconds,
  posterSlides,
  slideAt,
  slideSeconds,
} from "./posterSlides"

describe("posterSlides", () => {
  it("starts a new slide at a blank line, not a single newline", () => {
    expect(posterSlides("a\nb\n\n  \nc\n\n")).toEqual(["a\nb", "c"])
    expect(posterSlides("a\r\n\r\nb")).toEqual(["a", "b"])
  })
  it("has one empty slide for a heading-only poster", () => {
    expect(posterSlides("  ")).toEqual([""])
  })
})

describe("reading time", () => {
  it("reads the heading on the first slide", () => {
    expect(slideSeconds("To ord", "en to tre\n\nfire")).toEqual([
      3 + 0.4 * 5,
      3 + 0.4,
    ])
  })
  it("rounds the minimum up to whole seconds, at least five", () => {
    expect(posterMinimumSeconds("Hei", "")).toBe(5)
    expect(posterMinimumSeconds("To ord", "en to tre\n\nfire")).toBe(9)
  })
  it("doesn't round a whole number of seconds up", () => {
    // 3 s + 15 words: 0.4 * 15 is 6.000000000000001 in floating point.
    expect(posterMinimumSeconds("", Array(15).fill("ord").join(" "))).toBe(9)
  })
})

describe("slideAt", () => {
  // Slides of 5 s and 3.4 s: once round is 8.4 s.
  const [heading, text] = ["To ord", "en to tre\n\nfire"]
  it("shows each slide for its reading time when listed for the minimum", () => {
    expect(slideAt(heading, text, 8400, 4900)).toBe(0)
    expect(slideAt(heading, text, 8400, 5100)).toBe(1)
  })
  it("stretches a cycle rather than cutting the last slide short", () => {
    // 12 s fits one whole cycle, stretched by 12/8.4.
    expect(slideAt(heading, text, 12000, 7000)).toBe(0)
    expect(slideAt(heading, text, 12000, 7300)).toBe(1)
  })
  it("goes round again when two cycles fit", () => {
    expect(slideAt(heading, text, 16800, 8500)).toBe(0)
    expect(slideAt(heading, text, 16800, 13500)).toBe(1)
  })
  it("holds a single slide", () => {
    expect(slideAt("Hei", "bare én", 60000, 59000)).toBe(0)
  })
})

describe("paging", () => {
  it("matches Django and the frontend on the shared cases", () => {
    expect(cases.length).toBeGreaterThanOrEqual(10)
    for (const { name, heading, text, pages, minimumSeconds } of cases) {
      expect(posterSlides(text), name).toEqual(pages)
      expect(posterMinimumSeconds(heading, text), name).toBe(minimumSeconds)
      for (const page of pages)
        expect(Array.from(page).length).toBeLessThanOrEqual(PAGE_LENGTH)
    }
  })
  it("pages a long block at sentence ends, into even pages", () => {
    const sentence =
      "Dette er en setning som er akkurat passe lang til å fylle litt av en side. "
    const pages = posterSlides(sentence.repeat(8))
    expect(pages).toHaveLength(3)
    for (const page of pages) expect(page.endsWith("side.")).toBe(true)
  })
})
