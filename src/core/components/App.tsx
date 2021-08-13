import React from "react"

import { Global, css, ThemeProvider, Theme } from "@emotion/react"
import { lightTheme } from "../theming"

import { Screen } from "../components/Screen"

const globalStyle = (theme: Theme) => css`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: sans-serif;
    color: ${theme.fontColor.normal};
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
