import { SEQUENCE_NAMES } from "./constants"
import * as icons from "./icons"

// Represents the REST api collection format
export type ApiCollection<T> = {
  count: number
  results: T[]
}

export type IconType = keyof typeof icons
export type SequenceName = typeof SEQUENCE_NAMES[number]
