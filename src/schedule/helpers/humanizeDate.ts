import { frameClock, formatTime, osloParts } from "../../graphics/time"
import { differenceInMinutes, differenceInSeconds, format } from "date-fns"
import { nb } from "date-fns/locale"

export const humanizeDate = (date: Date): string => {
  const now = new Date(frameClock.now())
  const secondDifference = differenceInSeconds(date, now)

  if (secondDifference <= 0) {
    return "nå"
  }

  if (secondDifference < 60) {
    return `${secondDifference} sek`
  }

  if (differenceInMinutes(date, now) < 60) {
    return `${Math.round(secondDifference / 60)} min`
  }

  if (osloParts(+date).day === osloParts(+now).day) {
    return formatTime(+date)
  }

  return format(date, "HH:mm - d. MMM", { locale: nb })
}
