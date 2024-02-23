import { getMoodVideo } from "../../mood/helpers/getMoodVideo"

import { RESOLUTION, URL_PREFIX } from "../constants"

const [width, height] = RESOLUTION

const src = getMoodVideo("noon") //getPhaseOfDay(new Date(), ...OSLO_COORDINATES))

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
      {renderSource("webm", "video/webm")}
      {renderSource("mp4", "video/mp4")}
    </video>
  )
}
