export type TimeOfDay = "day" | "night"

// Represents the REST api collection format
export type ApiCollection<T> = {
  count: number
  results: T[]
}
