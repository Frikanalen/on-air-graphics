import { isAfter } from "date-fns"
import SunCalc from "suncalc"
import { PhaseOfDay } from "../types"

const timeMap: Record<keyof SunCalc.GetTimesResult, PhaseOfDay> = {
  sunrise: "sunrise",
  sunriseEnd: "sunrise",
  goldenHourEnd: "noon",
  solarNoon: "noon",
  goldenHour: "sunset",
  sunsetStart: "sunset",
  sunset: "sunset",
  dusk: "dusk",
  nauticalDusk: "dusk",
  night: "night",
  nadir: "night",
  nightEnd: "night",
  nauticalDawn: "dawn",
  dawn: "dawn",
}

export const getPhaseOfDay = (
  date: Date,
  latitude: number,
  longitude: number
): PhaseOfDay => {
  const times = SunCalc.getTimes(date, latitude, longitude)
  const entries = Object.entries(times) as [
    keyof SunCalc.GetTimesResult,
    Date
  ][]

  const result = entries
    .sort(([, a], [, b]) => b.valueOf() - a.valueOf())
    .find(([, target]) => isAfter(date, target))

  if (!result) {
    console.error("No phase of day found for date", date)
    return "noon"
  }

  return timeMap[result[0]]
}
