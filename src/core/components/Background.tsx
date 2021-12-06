import React from "react"
import { getMoodVideo } from "../../mood/helpers/getMoodVideo"

import { RESOLUTION, URL_PREFIX } from "../constants"
import { store } from "../store"

const [width, height] = RESOLUTION

const { timeOfDay } = store
const src = getMoodVideo(timeOfDay)

export function Background() {
  const renderSource = (ext: string, mime: string) => (
    <source src={`${URL_PREFIX}/video/${ext}/${src}.${ext}`} type={mime} />
  )

  return (
    <video
      width={width}
      height={height}
      loop={true}
      autoPlay={true}
      controls={false}
      muted
    >
      {renderSource("mp4", "video/mp4")}
      {renderSource("mkv", "video/x-matroska")}
    </video>
  )
}
