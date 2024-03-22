import stylex from "@stylexjs/stylex"

const DevContainerStyle = stylex.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#333",
  },
})
export const DevContainer = ({ children }: { children: React.ReactNode }) => (
  <div {...stylex.props(DevContainerStyle.container)}>{children}</div>
)
