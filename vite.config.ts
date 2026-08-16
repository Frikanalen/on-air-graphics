import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import stylex from "@stylexjs/unplugin"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ stylex.vite(), react()],
  base: "/graphics",
  build: {
    target: "es2019",
  },
})
