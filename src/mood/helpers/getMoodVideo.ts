import { getRandomItem } from "../../core/helpers/getRandomItem"
import { TIMES_OF_DAY_SUBSTITUTIONS } from "../constants"
import { TimeOfDay } from "../types"
import { catalog } from "../../catalog.ts"

const getSelection = (time: TimeOfDay) => {
  const primary = catalog.filter((m) => m.time === time)

  if (!primary.length) {
    const substitutions = catalog.filter((m) =>
      TIMES_OF_DAY_SUBSTITUTIONS[time].includes(m.time as TimeOfDay)
    )

    return substitutions
  }

  return primary
}

export const getMoodVideo = (time: TimeOfDay) => {
  const video = getRandomItem(getSelection(time))
  return video.url
}
