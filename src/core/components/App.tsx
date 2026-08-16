import { useState } from "react"
import { useParams } from "../hooks/useParams"
import { FADE_TRANSITION_MS, MINIMUM_SCREEN_TIME } from "../constants"
import { Content } from "./Content"
import { useSchedule } from "../useSchedule"
import { DevPanel } from "./DevPanel"
import { AppContext, type AppContextT, type AppState } from "./AppContext.tsx"
import { ScheduleContext } from "./ScheduleContext.tsx"

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

  window.play = () => {
    setState("active")
  }
  window.stop = () => {
    setState("exit")
  }

  const params = useParams({
    duration: MINIMUM_SCREEN_TIME,
    keyed: false,
  })

  const context: AppContextT = {
    state,
    keyed: params.keyed,
    // Ensures the duration is never less than the minimum
    duration: Math.max(
      params.duration - FADE_TRANSITION_MS,
      MINIMUM_SCREEN_TIME,
    ),
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
        {import.meta.env.DEV ? <DevPanel /> : <Content />}
      </ScheduleContext.Provider>
    </AppContext.Provider>
  )
}
