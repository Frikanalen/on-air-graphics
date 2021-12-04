import React from "react"

import { RESOLUTION, URL_PREFIX } from "../constants"
import { store } from "../store"

const [width, height] = RESOLUTION

export function Background() {
  const { timeOfDay } = store
  const src = `${URL_PREFIX}/video/${timeOfDay}.mkv`

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
