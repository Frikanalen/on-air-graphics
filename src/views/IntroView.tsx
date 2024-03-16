import { Logo } from "../core/components/Logo.tsx"
import stylex from "@stylexjs/stylex"
import { introVars, theme } from "../theme.stylex.ts"
import { cardStyle } from "../core/components/Card.tsx"
import { TransitionState } from "./types.ts"

const CardFall = stylex.keyframes({
  from: {},
  to: { transform: "rotate(10deg) translateY(60%)" },
})

const LogoUnblur = stylex.keyframes({
  from: {
    filter: "blur(120px)",
    opacity: 0,
  },
  to: { opacity: 1 },
})

const LogoFall = stylex.keyframes({
  from: {},
  "50%": { opacity: 0 },
  to: {
    transform: "translateY(800px)",
    opacity: 0,
  },
})

const backdropStyle = stylex.create({
  base: {
    position: "absolute",
    width: "200%",
    height: "200%",
    top: 0,
    right: 0,
    transform: "rotate(10deg) translateY(-220px)",
    content: "",
  },
  exiting: {
    animationName: CardFall,
    animationDuration: introVars.animationOutDuration,
    animationFillMode: "forwards",
  },
})

const containerStyle = stylex.create({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
    color: theme.fontColorNormal,
  },
})

const logoContainerStyles = stylex.create({
  base: {
    width: 600, // Assuming you want to set width to 600px
    position: "relative",
    zIndex: 1,
    animationTimingFunction: "ease-in-out",
  },
  entering: {
    animationName: LogoUnblur,
    animationDuration: introVars.animationInDuration,
    animationDelay: "200ms",
    opacity: 0,
    animationFillMode: "forwards",
  },
  exiting: {
    animationName: LogoFall,
    animationFillMode: "forwards",
    animationDuration: introVars.animationOutDuration,
  },
})

export const IntroView = ({
  sequencerCues: { transition },
}: {
  sequencerCues: TransitionState
}) => (
  <div>
    <div
      {...stylex.props(
        cardStyle.baseCard,
        backdropStyle.base,
        transition == "exiting" && backdropStyle.exiting,
      )}
    />
    <div {...stylex.props(containerStyle.base)}>
      <div
        {...stylex.props(
          logoContainerStyles.base,
          transition === "entering" && logoContainerStyles.entering,
          transition === "exiting" && logoContainerStyles.exiting,
        )}
      >
        <Logo />
      </div>
    </div>
  </div>
)
