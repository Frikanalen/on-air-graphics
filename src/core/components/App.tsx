import React, { createContext, useState } from "react"

import { Global, css, ThemeProvider, Theme } from "@emotion/react"
import { darkTheme, lightTheme } from "../theming"

import { store } from "../store"
import { useParams } from "../hooks/useParams"
import { FADE_TRANSITION_MS, MINIMUM_SCREEN_TIME } from "../constants"
import { Content } from "./Content"
import { getTheme } from "../../mood/helpers/getTheme"

const globalStyle = (theme: Theme) => css`
  @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap");

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: "Roboto", sans-serif;
    background: transparent;
    color: ${theme.fontColor.normal};
  }

  h1,
  h2,
  h3,
  h4 {
    line-height: 75%;
    margin: 0px;
  }

  h1 {
    font-size: 48px;
    font-weight: 900;
  }

  h2 {
    font-size: 20px;
    font-weight: 600;
  }
`

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
  const theme = getTheme(store.timeOfDay)
  const [state, setState] = useState<AppState>("idle")

  window.start = () => setState("active")
  window.stop = () => setState("exit")

  const params = useParams({
    duration: MINIMUM_SCREEN_TIME,
    keyed: false,
  })

  const context = {
    state,
    keyed: params.keyed,
    // Ensures the duration is never less than the minimum
    duration: Math.max(
      params.duration - FADE_TRANSITION_MS,
      MINIMUM_SCREEN_TIME
    ),
  }

  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyle} />
      <App.context.Provider value={context}>
        <Content />
      </App.context.Provider>
    </ThemeProvider>
  )
}

App.context = createContext<AppContext>({
  duration: MINIMUM_SCREEN_TIME,
  state: "idle",
  keyed: false,
})
