import React from "react"
import { getMoodVideo } from "../../mood/helpers/getMoodVideo"

import { RESOLUTION } from "../constants"
import { store } from "../store"

const [width, height] = RESOLUTION

const { timeOfDay } = store
const src = getMoodVideo(timeOfDay)

export function Background() {
  return (
    <video
      src={src}
      width={width}
      height={height}
      loop={true}
      autoPlay={true}
      controls={false}
      muted
    />
  )
}
