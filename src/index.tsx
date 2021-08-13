import React from "react"
import ReactDOM from "react-dom"
import { App } from "./core/components/App"
import { store } from "./core/store"

async function main() {
  await store.init()

  ReactDOM.render(<App />, document.getElementById("screen"))
}

main()
