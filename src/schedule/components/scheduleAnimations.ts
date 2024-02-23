import * as stylex from "@stylexjs/stylex"
import { theme } from "../../theme.stylex.ts"

export const animationTitleIn = stylex.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
})
export const animationTitleOut = stylex.keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
})
export const animationScheduleIn = stylex.keyframes({
  from: { transform: "translateX(-700px)" },
  to: { transform: "translateY(0)" },
})
export const animationScheduleOut = stylex.keyframes({
  from: { transform: "translateY(0)" },
  to: { transform: "translateX(-700px)" },
})
export const slideFadeIn = stylex.keyframes({
  from: { opacity: 0, transform: "translateX(50px)" },
  to: { opacity: 1, transform: "translateY(0px)" },
})
export const slideFadeOut = stylex.keyframes({
  from: { opacity: 1, transform: "translateY(0px)" },
  to: { opacity: 0, transform: "translateX(50px)" },
})
export const slideStyles = stylex.create({
  base: {
    animationName: slideFadeIn,
    animationDuration: "500ms",
    animationFillMode: "forwards",
    animationTimingFunction: "ease",
  },
  exiting: {
    animationName: slideFadeOut,
  },
})
export const containerIn = stylex.keyframes({
  from: {
    opacity: 0,
    transform: "rotate(10deg) translateY(-90px) translateX(200px)",
  },
  to: { opacity: 1, transform: "rotate(0) translateY(0) translateX(0)" },
})
export const containerOut = stylex.keyframes({
  from: { opacity: 1, transform: "rotate(0) translateY(0) translateX(0)" },
  to: {
    opacity: 0,
    transform: "rotate(10deg) translateY(-90px) translateX(200px)",
  },
})
export const footerIn = stylex.keyframes({
  from: { opacity: 0, transform: "translateY(200px)" },
  to: { opacity: 1, transform: "translateY(0)" },
})
export const footerOut = stylex.keyframes({
  from: { opacity: 1, transform: "translateY(0)" },
  to: { opacity: 0, transform: "translateY(200px)" },
})
export const scheduleStyles = stylex.create({
  exiting: {
    animationName: animationScheduleOut,
    animationDuration: "1000ms",
    animationFillMode: "forwards",
    animationTimingFunction: "ease",
  },
  base: {
    animationName: animationScheduleIn,
    animationDuration: "1000ms",
    animationFillMode: "forwards",
    animationTimingFunction: "ease",
  },
  nextCardBase: {
    marginTop: "24px",
    marginBottom: "42px",
  },
  laterListCardBase: {
    marginTop: "24px",
    animationDelay: "100ms",
  },
})
export const titleStyle = stylex.create({
  base: {
    color: theme.fontColorNormal,
    transition: "all 500ms ease",
    animationTimingFunction: "ease",
    animationFillMode: "forwards",
    animationDuration: "500ms",
    animationName: animationTitleIn,
  },
  exiting: {
    animationName: animationTitleOut,
  },
})
