import stylex from "@stylexjs/stylex"
import { RESOLUTION, theme } from "../../theme.stylex.ts"

const [width, height] = RESOLUTION

const styles = stylex.create({
  container: {
    position: "relative",
    overflow: "hidden",
    background: "transparent",
  },
  inner: {
    transition: theme.transition,
    opacity: 1,
  },
  transparent: { opacity: 0 },
  view: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
})
export const FullsizeContainer = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <div {...stylex.props(styles.container)} style={{ width, height }}>
    <div {...stylex.props(styles.inner)}>
      <div {...stylex.props(styles.view)}>{children}</div>
    </div>
  </div>
)
