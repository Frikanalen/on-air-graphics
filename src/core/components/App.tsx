import { useState } from "react"
import { css, Global, type Theme, ThemeProvider } from "@emotion/react"
import styled from "@emotion/styled"
import { useParams } from "../hooks/useParams"
import { FADE_TRANSITION_MS, MINIMUM_SCREEN_TIME } from "../constants"
import { Content } from "./Content"
import { getTheme } from "../../mood/helpers/getTheme"
import { useSchedule } from "../useSchedule"
import { DevPanel } from "./DevPanel"
import { AppContext, type AppContextT, type AppState } from "./AppContext.tsx"

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

const LoadingDiv = styled.div`
  flex-grow: 1;
  background: #333;
  color: #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-height: 100vh;

  div {
    display: flex;
    align-items: center;
    flex-grow: 1;
    font-size: 3em;
    font-family: monospace;
  }
`

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
    duration: Math.max(
      params.duration - FADE_TRANSITION_MS,
      MINIMUM_SCREEN_TIME,
    ),
  }

  if (loading)
    return (
      <LoadingDiv>
        <div>Loading...</div>
      </LoadingDiv>
    )

  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyle} />
      <AppContext.Provider value={context}>
        {import.meta.env.DEV ? <DevPanel /> : <Content />}
      </AppContext.Provider>
    </ThemeProvider>
  )
}
