import { getMoodVideo } from "../../mood/helpers/getMoodVideo"
import { RESOLUTION } from "../../theme.stylex.ts"

const [width, height] = RESOLUTION

const src = getMoodVideo("noon") //getPhaseOfDay(new Date(), ...OSLO_COORDINATES))

const VideoSource = ({ ext, mime }: { ext: string; mime: string }) => (
  <source src={`/graphics/video/${ext}/${src}.${ext}`} type={mime} />
)

export const BackgroundVideo = () => (
  <video
    width={width}
    height={height}
    loop={true}
    autoPlay={true}
    controls={false}
    muted
  >
    <VideoSource ext="webm" mime="video/webm" />
    <VideoSource ext="mp4" mime="video/mp4" />
  </video>
)
