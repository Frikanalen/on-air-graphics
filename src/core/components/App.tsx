import React from "react"

import { Global, css, ThemeProvider, Theme } from "@emotion/react"
import { lightTheme } from "../theming"

import { Screen } from "../components/Screen"

const globalStyle = (theme: Theme) => css`
  @import url("https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;700;900&display=swap");

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: "Source Sans Pro", sans-serif;
    color: ${theme.fontColor.normal};
  }

  h1 {
    font-size: 48px;
    font-weight: 900;
    margin: 0px;
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
