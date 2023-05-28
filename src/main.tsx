import React from "react"
import ReactDOM from 'react-dom/client'
import { App } from "./core/components/App"
import { store } from "./core/store"
//import './index.css'

async function main() {
  await store.init()
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

main()


