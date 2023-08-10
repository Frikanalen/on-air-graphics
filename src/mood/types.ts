export type PhaseOfDay =
  | "sunrise"
  | "noon"
  | "sunset"
  | "dusk"
  | "night"
  | "dawn"

// Spring is skipped because it's too similar to summer
export type Season = "summer" | "winter" | "autumn"

export type MoodVideo = {
  url: string
  time: PhaseOfDay
  season: Season
}
