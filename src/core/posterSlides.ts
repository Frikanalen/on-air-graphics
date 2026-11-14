/**
 * How a member's text poster splits into slides and how long it takes to
 * read. Django (scheduling/posters.py) and the frontend keep the same rule,
 * so the minimum length the editor offers is the one the API accepts.
 *
 * A blank line in the text starts a new slide. A slide takes SLIDE_SECONDS
 * plus WORD_SECONDS for each word on it; the heading is read on the first
 * slide. A poster is at least long enough to show every slide once.
 */
export const SLIDE_SECONDS = 3
export const WORD_SECONDS = 0.4
export const POSTER_SHORTEST_SECONDS = 5

export const posterSlides = (text: string): string[] => {
  const slides = text
    .split(/\n[ \t]*\n/)
    .map((slide) => slide.trim())
    .filter(Boolean)
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
export const posterMinimumSeconds = (heading: string, text: string): number =>
  Math.max(
    POSTER_SHORTEST_SECONDS,
    Math.ceil(slideSeconds(heading, text).reduce((a, b) => a + b, 0)),
  )

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
