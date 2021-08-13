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

  h1,
  h2,
  h3,
  h4 {
    margin: 0px;
  }

  h1 {
    font-size: 48px;
    font-weight: 900;
  }

  h2 {
    font-size: 24px;
    font-weight: 600;
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
