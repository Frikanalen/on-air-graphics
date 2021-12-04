import { VIEW_TYPES } from "./constants"
import * as icons from "./icons"

export type TimeOfDay = "day" | "night"

// Represents the REST api collection format
export type ApiCollection<T> = {
  count: number
  results: T[]
}

export type IconType = keyof typeof icons
export type ViewType = typeof VIEW_TYPES[number]
