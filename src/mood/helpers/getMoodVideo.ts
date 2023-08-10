import { getRandomItem } from "../../core/helpers/getRandomItem"
import { TIMES_OF_DAY_SUBSTITUTIONS } from "../constants"
import { PhaseOfDay } from "../types"
import { catalog } from "../../catalog.ts"

const getSelection = (time: PhaseOfDay) => {
  const primary = catalog.filter((m) => m.time === time)

  if (!primary.length) {
    const substitutions = catalog.filter((m) =>
      TIMES_OF_DAY_SUBSTITUTIONS[time].includes(m.time as PhaseOfDay)
    )

    return substitutions
  }

  return primary
}

export const getMoodVideo = (time: PhaseOfDay) => {
  const video = getRandomItem(getSelection(time))
  return video.url
}
