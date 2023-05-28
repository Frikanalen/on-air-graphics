import { isAfter } from "date-fns"
import SunCalc from "suncalc"
import { TimeOfDay } from "../types"

const timeMap: Record<keyof SunCalc.GetTimesResult, TimeOfDay> = {
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

export const getTimeOfDay = (
  date: Date,
  lattitude: number,
  longitude: number
): TimeOfDay => {
  const times = SunCalc.getTimes(date, lattitude, longitude)
  const entries = Object.entries(times) as [
    keyof SunCalc.GetTimesResult,
    Date
  ][]

  const result = entries
    .sort(([, a], [, b]) => b.valueOf() - a.valueOf())
    .find(([, target]) => isAfter(date, target))

  if (!result) {
    throw new Error("Result is undefined!")
  }

  return timeMap[result[0]]
}
