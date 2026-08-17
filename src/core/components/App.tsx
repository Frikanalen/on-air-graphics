import { useEffect, useState } from "react"
import { useParams } from "../hooks/useParams"
import { DEFAULT_BUDGET_MS } from "../constants"
import { Content } from "./Content"
import { useSchedule } from "../useSchedule"
import { DevPanel } from "./DevPanel"
import { AppContext, type AppContextT, type AppState } from "./AppContext.tsx"
import { ScheduleContext } from "./ScheduleContext.tsx"
import { PlayheadContext } from "../../sequencing/clock/PlayheadContext.ts"
import { createPlayhead } from "../../sequencing/clock/playhead.ts"

window.update = (data: unknown) => {
  console.error(`Update was called with ${JSON.stringify(data)}`)
}

window.next = () => {
  console.error("Next was called")
}

window.handleError = console.error
window.handleWarning = console.error

console.warn("Test warning")

export function App() {
  const { schedule, loading } = useSchedule()

  const [state, setState] = useState<AppState>("idle")
  const [playhead] = useState(createPlayhead)
  const params = useParams({
    duration: DEFAULT_BUDGET_MS,
  })
  const hasDuration = new URLSearchParams(window.location.search).has("duration")

  window.play = () => {
    setState("active")
  }
  window.stop = () => {
    setState("exit")
  }

  useEffect(() => {
    if (!hasDuration && typeof window.play === "function") {
      window.play()
    }
  }, [hasDuration])

  /*
   * The budget is measured from the cue, not from page load: the playout system
   * loads the template some time before it plays it, and the time it is asking
   * for starts when it says so.
   */
  useEffect(() => {
    if (state === "active") playhead.restart()
    else playhead.pause()
  }, [state, playhead])

  const context: AppContextT = {
    state,
    budget: params.duration,
  }

  if (loading)
    return (
      <div className="flex min-h-screen grow flex-col items-center justify-center bg-[#333] text-[#ddd]">
        <div className="flex grow items-center font-mono text-[3em]">
          Loading...
        </div>
      </div>
    )

  return (
    <AppContext.Provider value={context}>
      <ScheduleContext.Provider value={schedule}>
        <PlayheadContext.Provider value={playhead}>
          {import.meta.env.DEV || !hasDuration ? <DevPanel /> : <Content />}
        </PlayheadContext.Provider>
      </ScheduleContext.Provider>
    </AppContext.Provider>
  )
}
