import stylex from "@stylexjs/stylex"

const HStackStyle = stylex.create({
  div: {
    background: "black",
    width: `100%`,
    padding: "1em",
    display: "flex",
    alignItems: "baseline",
    gap: "2em",
    color: "#ddd",
  },
})
export const HStack = ({ children }: { children: React.ReactNode }) => (
  <div {...stylex.props(HStackStyle.div)}>{children}</div>
)
