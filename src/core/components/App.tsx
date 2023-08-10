import { createContext, useState } from "react"
import { Global, css, ThemeProvider, Theme } from "@emotion/react"
import { useParams } from "../hooks/useParams"
import { FADE_TRANSITION_MS, MINIMUM_SCREEN_TIME } from "../constants"
import { Content } from "./Content"
import { getTheme } from "../../mood/helpers/getTheme"
import { getPhaseOfDay } from "../../mood/helpers/getPhaseOfDay"
import { OSLO_COORDINATES } from "../../mood/constants"
import { useSchedule } from "../useSchedule"
import { DevPanel } from "./DevPanel"

const globalStyle = (theme: Theme) => css`
  color: ${theme.fontColor.normal};
`

window.update = (data: any) => {
  console.log(`Update was called with ${JSON.stringify(data)}`)
}

window.next = () => {
  console.log("Next was called")
}

window.handleError = console.error
window.handleWarning = console.log

export type AppState = "idle" | "active" | "exit"

export type AppContext = {
  /** Animation state */
  state: AppState
  /** The total duration of the graphics being shown */
  duration: number
  /** Is the graphics superimposed on top of the stream? */
  keyed: boolean
}

export function App() {
  const theme = getTheme(getPhaseOfDay(new Date(), ...OSLO_COORDINATES))
  const { loading } = useSchedule()

  const [state, setState] = useState<AppState>("active")

  window.play = () => setState("active")
  window.stop = () => setState("exit")

  const params = useParams({
    duration: MINIMUM_SCREEN_TIME,
    keyed: false,
  })

  const context: AppContext = {
    state,
    keyed: params.keyed,
    // Ensures the duration is never less than the minimum
    duration: Math.max(
      params.duration - FADE_TRANSITION_MS,
      MINIMUM_SCREEN_TIME
    ),
  }

  if (loading) return null

  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyle} />
      <App.context.Provider value={context}>
        <div className="bg-black w-screen h-screen flex justify-center items-center">
          <Content />
          <DevPanel />
        </div>
      </App.context.Provider>
    </ThemeProvider>
  )
}

App.context = createContext<AppContext>({
  duration: MINIMUM_SCREEN_TIME,
  state: "idle",
  keyed: false,
})
