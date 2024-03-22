import stylex from "@stylexjs/stylex"

const VStackStyle = stylex.create({
  div: {
    display: "flex",
    flexDirection: "column",
    gap: "2em",
  },
})
export const VStack = ({ children }: { children: React.ReactNode }) => (
  <div {...stylex.props(VStackStyle.div)}>{children}</div>
)
