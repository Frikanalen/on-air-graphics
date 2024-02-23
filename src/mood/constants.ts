import { PhaseOfDay } from "./types.ts"

export const TIMES_OF_DAY = [
  "sunrise",
  "noon",
  "sunset",
  "dusk",
  "night",
  "dawn",
] as const

export const TIMES_OF_DAY_SUBSTITUTIONS: Record<PhaseOfDay, PhaseOfDay[]> = {
  sunrise: ["dawn"],
  noon: ["sunset"],
  sunset: ["dusk"],
  dusk: ["night", "dawn"],
  night: ["dawn"],
  dawn: ["sunrise"],
}

// Lattitude and longitude
export const OSLO_COORDINATES = [59.9139, 10.7522] as const
