/**
 * How a text for the screen splits into pages and how long it takes to
 * read: a member's text poster and the channel's bulletins. Django
 * (scheduling/posters.py) and the frontend keep the same rule, and all three
 * run the cases in paging-cases.json.
 *
 * A blank line in the text starts a new slide. A block longer than
 * PAGE_LENGTH characters is paged by itself: at sentence ends where it can,
 * between words where a sentence is too long, and into pages of about the
 * same length rather than full ones and a short last one. A slide takes
 * SLIDE_SECONDS plus WORD_SECONDS for each word on it; the heading is read
 * on the first slide. A poster is at least long enough to show every slide
 * once.
 */
export const SLIDE_SECONDS = 3
export const WORD_SECONDS = 0.4
export const POSTER_SHORTEST_SECONDS = 5
/** What fits on one page in the largest of the type sizes long text gets. */
export const PAGE_LENGTH = 280

const SPACE = " \t\n\u00a0"
const SENTENCE_END = ".!?\u2026"
const CLOSERS = "\"'\u00bb\u201d\u2019)]"
const OPENERS = "\"'\u00ab\u201c\u2018(["

/** Trims the kinds of space the rule knows, and no others. */
const trim = (chars: string[]) => {
  let start = 0,
    end = chars.length
  while (start < end && SPACE.includes(chars[start])) start++
  while (end > start && SPACE.includes(chars[end - 1])) end--
  return chars.slice(start, end)
}

const startsSentence = (char: string) =>
  OPENERS.includes(char) ||
  (char !== char.toLowerCase() && char === char.toUpperCase())

/**
 * The block cut where a page may end: after a sentence, when the next one
 * starts with a capital, and after a line break. Each piece keeps the space
 * that follows it. Characters are code points throughout, as in Python.
 */
const sentences = (block: string[]): string[][] => {
  const pieces: string[][] = []
  let start = 0,
    i = 0
  while (i < block.length) {
    const char = block[i]
    let end = -1
    if (char === "\n") end = i + 1
    else if (SENTENCE_END.includes(char)) {
      let j = i + 1
      while (
        j < block.length &&
        (SENTENCE_END.includes(block[j]) || CLOSERS.includes(block[j]))
      )
        j++
      if (j < block.length && SPACE.includes(block[j])) end = j
    }
    if (end < 0) {
      i++
      continue
    }
    while (end < block.length && SPACE.includes(block[end])) end++
    if (char === "\n" || end === block.length || startsSentence(block[end])) {
      pieces.push(block.slice(start, end))
      start = end
    }
    i = end
  }
  if (start < block.length) pieces.push(block.slice(start))
  return pieces
}

/** A sentence too long for one page, cut between words (and a word too long
 * for a page, cut where the page ends). */
const wordsOf = (piece: string[], limit: number): string[][] => {
  const words: string[][] = []
  let word: string[] = []
  const push = () => {
    while (word.length > limit) {
      words.push([...word.slice(0, limit), " "])
      word = word.slice(limit)
    }
    if (word.length) words.push([...word, " "])
    word = []
  }
  for (const char of trim(piece)) {
    if (SPACE.includes(char)) push()
    else word.push(char)
  }
  push()
  return words
}

const fill = (pieces: string[][], limit: number): string[] => {
  const pages: string[] = []
  let current: string[] = []
  for (const sentence of pieces) {
    const fits = trim(sentence).length <= limit
    for (const piece of fits ? [sentence] : wordsOf(sentence, limit)) {
      if (trim([...current, ...piece]).length <= limit) {
        current = [...current, ...piece]
        continue
      }
      if (trim(current).length) pages.push(trim(current).join(""))
      current = piece
    }
  }
  if (trim(current).length) pages.push(trim(current).join(""))
  return pages
}

const page = (text: string): string[] => {
  const block = Array.from(text)
  if (block.length <= PAGE_LENGTH) return [text]
  const pieces = sentences(block)
  const count = fill(pieces, PAGE_LENGTH).length
  // The same number of pages, as even as they come: the smallest page size
  // that still gives that number.
  for (
    let limit = Math.ceil(block.length / count);
    limit < PAGE_LENGTH;
    limit++
  ) {
    const pages = fill(pieces, limit)
    if (pages.length <= count) return pages
  }
  return fill(pieces, PAGE_LENGTH)
}

export const posterSlides = (text: string): string[] => {
  const slides = text
    .replace(/\r\n/g, "\n")
    .split(/\n[ \t]*\n/)
    .map((block) => trim(Array.from(block)).join(""))
    .filter(Boolean)
    .flatMap(page)
  return slides.length ? slides : [""]
}

const words = (text: string) => text.split(/\s+/).filter(Boolean).length

/** Seconds to read each slide once. */
export const slideSeconds = (heading: string, text: string): number[] =>
  posterSlides(text).map(
    (slide, index) =>
      SLIDE_SECONDS +
      WORD_SECONDS * (words(slide) + (index === 0 ? words(heading) : 0)),
  )

/** The shortest a poster may be listed for, in whole seconds. */
export const posterMinimumSeconds = (heading: string, text: string): number => {
  // Summed in tenths, so float error can't round 6.0 s up to 7.
  const tenths = slideSeconds(heading, text).reduce(
    (sum, seconds) => sum + Math.round(seconds * 10),
    0,
  )
  return Math.max(POSTER_SHORTEST_SECONDS, Math.ceil(tenths / 10))
}

/**
 * Which slide shows `elapsed` ms into a poster listed for `duration` ms. The
 * slides go round in whole cycles, as many as fit, each slide holding its
 * share of the cycle; so the last slide is never cut short.
 */
export const slideAt = (
  heading: string,
  text: string,
  duration: number,
  elapsed: number,
): number => {
  const reading = slideSeconds(heading, text)
  if (reading.length === 1) return 0
  const once = reading.reduce((a, b) => a + b, 0) * 1000
  const cycles = Math.max(1, Math.floor(duration / once))
  const cycle = Math.max(duration, once) / cycles
  let at = (((elapsed % cycle) + cycle) % cycle) * (once / cycle)
  for (const [index, seconds] of reading.entries()) {
    at -= seconds * 1000
    if (at < 0) return index
  }
  return reading.length - 1
}
