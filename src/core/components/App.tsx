import React from "react"

import { Global, css, ThemeProvider } from "@emotion/react"
import { lightTheme } from "../theming"

import { Screen } from "../components/Screen"

const globalStyle = css`
  body {
    margin: 0;
    font-family: sans-serif;
  }
`

export function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <Global styles={globalStyle} />
      <Screen />
    </ThemeProvider>
  )
}
