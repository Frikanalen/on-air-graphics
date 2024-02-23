import { Logo } from "./Logo"
import { TransitionStatus } from "react-transition-group"
import { SequenceEntry } from "../../sequencing/components/ViewSequence"
import stylex from "@stylexjs/stylex"
import { theme } from "../../theme.stylex.ts"
import { cardStyle } from "./Card.tsx"

const ENTER_MS = 1200
const EXIT_MS = 700

export const INTRO_VIEW_SEQUENCE_ENTRY: SequenceEntry = {
  name: "intro",
  duration: ENTER_MS + 2000,
  render: (status) => <IntroView status={status} />,
  overlay: false,
}

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
    animationDuration: `${EXIT_MS}ms`,
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
    animationDuration: `${ENTER_MS}ms`, // ENTER_MS should be a predefined constant
    animationDelay: "200ms",
    opacity: 0,
    animationFillMode: "forwards",
  },
  exiting: {
    animationName: LogoFall,
    animationFillMode: "forwards",
    animationDuration: `${EXIT_MS}ms`, // EXIT_MS should be a predefined constant
  },
})

export type IntroView = {
  status: TransitionStatus
}

export const IntroView = ({ status }: IntroView) => {
  console.log(status)
  return (
    <div>
      <div
        {...stylex.props(
          cardStyle.baseCard,
          backdropStyle.base,
          status == "exiting" && backdropStyle.exiting,
        )}
      />
      <div {...stylex.props(containerStyle.base)}>
        <div
          {...stylex.props(
            logoContainerStyles.base,
            status === "entering" && logoContainerStyles.entering,
            status === "exiting" && logoContainerStyles.exiting,
          )}
        >
          <Logo />
        </div>
      </div>
    </div>
  )
}
