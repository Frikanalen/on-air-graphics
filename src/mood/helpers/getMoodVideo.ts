import catalog from "../../../public/video/catalog.json"
import { IS_CASPARCG_CONTEXT, URL_PREFIX } from "../../core/constants"
import { getRandomItem } from "../../core/helpers/getRandomItem"
import { TIMES_OF_DAY_SUBSTITUTIONS } from "../constants"
import { TimeOfDay } from "../types"

const getSelection = (time: TimeOfDay) => {
  const primary = catalog.filter((m) => m.time === time)

  if (primary.length === 0) {
    const substitutions = catalog.filter((m) =>
      TIMES_OF_DAY_SUBSTITUTIONS[time].includes(m.time as TimeOfDay)
    )

    return substitutions
  }

  return primary
}

export const getMoodVideo = (time: TimeOfDay) => {
  const video = getRandomItem(getSelection(time))
  const ext = IS_CASPARCG_CONTEXT ? "mkv" : "mp4"

  return `${URL_PREFIX}/video/${ext}/${video.url}.${ext}`
}
