import {
  differenceInHours,
  differenceInSeconds,
  format,
  formatDistance,
  isToday,
} from "date-fns"
import { nb } from "date-fns/locale"

export const humanizeDate = (date: Date) => {
  const now = new Date()

  const secondDifference = differenceInSeconds(date, now)
  if (secondDifference <= 0) {
    return "nå"
  }

  const hourDifference = differenceInHours(date, now)
  if (hourDifference < 1) {
    return formatDistance(date, now, {
      includeSeconds: true,
      locale: nb,
    }).replace("omtrent", "om")
  }

  if (isToday(date)) {
    return format(date, "HH:mm", { locale: nb })
  }

  return format(date, "HH:mm - d. MMM", { locale: nb })
}
