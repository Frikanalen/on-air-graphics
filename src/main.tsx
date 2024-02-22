import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./core/components/App"
import "./index.css"

console.error("Hello, world!")

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
