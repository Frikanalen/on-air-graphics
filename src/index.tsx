import React from "react"
import ReactDOM from "react-dom"

import { Global, css, ThemeProvider } from "@emotion/react"
import { lightTheme } from "./core/theming"

import { Screen } from "./core/components/Screen"

const globalStyle = css`
  body {
    margin: 0;
    font-family: sans-serif;
  }
`

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <Global styles={globalStyle} />
      <Screen />
    </ThemeProvider>
  )
}

ReactDOM.render(<App />, document.getElementById("screen"))
