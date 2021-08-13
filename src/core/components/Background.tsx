import React from "react"

import { RESOLUTION } from "../constants"
import { TimeOfDay } from "../types"
const [width, height] = RESOLUTION

export type BackgroundProps = {
  timeOfDay: TimeOfDay
}

export function Background(props: BackgroundProps) {
  const { timeOfDay } = props
  const src = `/video/${timeOfDay}.mp4`

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
