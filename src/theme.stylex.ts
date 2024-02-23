import * as stylex from "@stylexjs/stylex"

const DARK = "@media (prefers-color-scheme: dark)"
const DARK_BLUR =
  "@media (prefers-color-scheme: dark) and (@supports (backdrop-filter: blur(30px)))"

const BLUR = "@supports (backdrop-filter: blur(30px))"

export const theme = stylex.defineVars({
  colorCard: {
    default: "rgba(255, 255, 255, 0.8)",
    [BLUR]: "rgba(255, 255, 255, 0.45)",
    [DARK]: "rgba(26, 42, 64, 0.85)",
    [DARK_BLUR]: "rgba(26, 42, 64, 0.7)",
  },
  colorAccent: { default: "#E88840", [DARK]: "#FCBA20" },
  fontColorOverlay: "white",
  fontColorNormal: {
    default: "rgba(0, 0, 0, 0.85)",
    [DARK]: "rgba(255, 255, 255, 0.85)",
  },
  fontColorMuted: {
    default: "rgba(0, 0, 0, 0.7)",
    [DARK]: "rgba(255, 255, 255, 0.7)",
  },
  stateColorWarning: { default: "#ff5400", [DARK]: "#ff5400" },
  gradientOverlay: {
    default:
      "linear-gradient(0deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 35%)",
    [DARK]: "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 35%)",
  },
  shadowCard: {
    default: "3px 3px 11px 1px rgb(0 0 0 / 10%)",
    [DARK]: "3px 3px 15px 1px rgb(0 0 0 / 15%)",
  },
})
