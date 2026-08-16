import { useContext, useState } from "react"
import { RESOLUTION } from "../constants"
import { PlayheadContext } from "../../sequencing/clock/PlayheadContext.ts"
import { Content } from "./Content"

const button =
  "cursor-pointer border-none bg-[#333] px-4 py-2 font-mono font-bold text-[#ddd] hover:bg-[#444] active:bg-[#555]"

export const DevPanel = () => {
  const playhead = useContext(PlayheadContext)

  const [show, setShow] = useState(true)

  /*
   * The clock outlives Content now, so remounting the views is not enough to
   * start the timeline over -- the playhead has to be sent back to zero too.
   */
  const reset = () => {
    setShow(false)
    setTimeout(() => {
      setShow(true)
      window.play()
      playhead.restart()
    }, 100)
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#333]">
      <div className="flex flex-col gap-8" style={{ maxWidth: RESOLUTION[0] }}>
        <h1 className="w-full text-[#999]">Frikanalen sendegrafikk</h1>
        {show && <Content />}
        <div
          className="flex items-baseline gap-8 bg-black p-4 text-[#ddd]"
          style={{ width: RESOLUTION[0] }}
        >
          <button className={button} onClick={reset}>
            RESET
          </button>
          <h2>Events</h2>
          <button className={button} onClick={window.play}>
            PLAY
          </button>
          <button className={button} onClick={window.stop}>
            STOP
          </button>
        </div>
      </div>
    </div>
  )
}
