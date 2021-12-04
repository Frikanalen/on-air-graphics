import { Theme } from "@emotion/react"

export const lightTheme: Theme = {
  color: {
    card: "rgba(255, 255, 255, 0.75)",
    accent: "#E88840",
  },
  fontColor: {
    overlay: "white",
    normal: "rgba(0, 0, 0, 0.85)",
    muted: "rgba(0, 0, 0, 0.7)",
  },
  stateColor: {
    warning: "#ff5400",
  },
  gradient: {
    overlay:
      "linear-gradient(0deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 35%)",
  },
}

export const darkTheme: Theme = {
  ...lightTheme,
  color: {
    card: "rgba(15, 27, 45, 0.75);",
    accent: "#FCBA20",
  },
  fontColor: {
    ...lightTheme.fontColor,
    normal: "rgba(255, 255, 255, 0.85)",
    muted: "rgba(255, 255, 255, 0.7)",
  },
  stateColor: {
    warning: "#ff5400",
  },
  gradient: {
    overlay: "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 35%)",
  },
}
