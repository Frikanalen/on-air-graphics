import { useEffect, useState } from "react"
import { useParams } from "../hooks/useParams"
import { DEFAULT_BUDGET_MS } from "../constants"
import { Content } from "./Content"
import { useSchedule } from "../useSchedule"
import { DevPanel } from "./DevPanel"
import { AppContext, type AppContextT, type AppState } from "./AppContext.tsx"
import { ScheduleContext } from "./ScheduleContext.tsx"
import { PlayheadContext } from "../../sequencing/clock/PlayheadContext.ts"
import { frozen } from "../../graphics/time"
import { useSceneAssets } from "../../graphics/useSceneAssets"
import { createPlayhead } from "../../sequencing/clock/playhead.ts"

window.update = (data: unknown) => {
  console.error(`Update was called with ${JSON.stringify(data)}`)
}

window.next = () => {
  console.error("Next was called")
}

window.handleError = console.error
window.handleWarning = console.error

export function App() {
  const { schedule, loading } = useSchedule()
  const assetsReady = useSceneAssets()

  const [state, setState] = useState<AppState>("idle")
  const [playhead] = useState(createPlayhead)
  const params = useParams({
    duration: DEFAULT_BUDGET_MS,
  })
  const query = new URLSearchParams(window.location.search)
  const preview = query.has("view")
  const dev =
    query.get("dev") === "true" ||
    (import.meta.env.DEV && query.get("dev") !== "false" && !preview)
  const hasDuration = new URLSearchParams(window.location.search).has(
    "duration",
  )

  window.play = () => {
    setState("active")
  }
  window.stop = () => {
    setState("exit")
  }

  useEffect(() => {
    if ((!hasDuration || preview) && typeof window.play === "function") {
      window.play()
    }
  }, [hasDuration, preview])

  /*
   * The budget is measured from the cue, not from page load: the playout system
   * loads the template some time before it plays it, and the time it is asking
   * for starts when it says so.
   */
  useEffect(() => {
    if (state === "active") {
      playhead.restart()
      if (preview || frozen) {
        playhead.pause()
        playhead.seek(preview ? 2000 : 0)
      }
    } else playhead.pause()
  }, [state, playhead, preview])

  const context: AppContextT = {
    state,
    budget: params.duration,
  }

  if (loading || !assetsReady)
    return (
      <div className="flex min-h-screen grow flex-col items-center justify-center bg-[#0F1926] text-[#F5EFE4]">
        <div className="flex grow items-center font-mono text-[3em]">
          Loading...
        </div>
      </div>
    )

  return (
    <AppContext.Provider value={context}>
      <ScheduleContext.Provider value={schedule}>
        <PlayheadContext.Provider value={playhead}>
          {dev ? (
            <DevPanel />
          ) : (
            <div className="output-stage">
              <Content />
            </div>
          )}
        </PlayheadContext.Provider>
      </ScheduleContext.Provider>
    </AppContext.Provider>
  )
}
