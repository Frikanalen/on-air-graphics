import axios from "axios"

export const api = axios.create({
  // Use the full frikanalen.no origin when running in development so the
  // dev server can reach the API at the canonical host. In production the
  // graphics are served from the same origin, so use a relative /api path.
  baseURL: import.meta.env.DEV ? "https://frikanalen.no/api" : "/api",
})
