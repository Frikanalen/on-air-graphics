import { useState } from "react"
import { css, Global, type Theme, ThemeProvider } from "@emotion/react"
import { useParams } from "../hooks/useParams"
import { FADE_TRANSITION_MS, MINIMUM_SCREEN_TIME } from "../constants"
import { Sequencer } from "./Sequencer.tsx"
import { getTheme } from "../../mood/helpers/getTheme"
import { useSchedule } from "../useSchedule"
import { DevPanel } from "./DevPanel"
import { AppContext, type AppContextT, type AppState } from "./AppContext.tsx"
import stylex from "@stylexjs/stylex"

const globalStyle = (theme: Theme) => css`
  color: ${theme.fontColor.normal};
`

window.update = (data: unknown) => {
  console.error(`Update was called with ${JSON.stringify(data)}`)
}

window.next = () => {
  console.error("Next was called")
}

window.handleError = console.error
window.handleWarning = console.error

console.warn("Test warning")

const loadingDiv = stylex.create({
  container: {
    flexGrow: 1,
    background: "#333",
    color: "#ddd",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  inner: {
    display: "flex",
    alignItems: "center",
    flexGrow: 1,
    fontSize: "3em",
    fontFamily: "monospace",
  },
})

export function App() {
  const theme = getTheme("noon") //getPhaseOfDay(new Date(), ...OSLO_COORDINATES))
  const { loading } = useSchedule()
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
    durationMs: Math.max(
      params.duration - FADE_TRANSITION_MS,
      MINIMUM_SCREEN_TIME,
    ),
  }

  if (loading)
    return (
      <div {...stylex.props(loadingDiv.container)}>
        <div {...stylex.props(loadingDiv.inner)}>Loading...</div>
      </div>
    )

  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyle} />
      <AppContext.Provider value={context}>
        {import.meta.env.DEV ? <DevPanel /> : <Sequencer />}
      </AppContext.Provider>
    </ThemeProvider>
  )
}
