import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./core/components/App"
import "./index.css"

console.log("main.tsx running")

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
