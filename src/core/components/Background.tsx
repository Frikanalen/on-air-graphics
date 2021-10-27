import React from "react"

import { RESOLUTION } from "../constants"
import { store } from "../store"
const [width, height] = RESOLUTION

export function Background() {
  const { timeOfDay } = store
  const src = `video/${timeOfDay}.mp4`

  return (
    <video
      src={src}
      width={width}
      height={height}
      loop={true}
      autoPlay={true}
      controls={false}
    />
  )
}
