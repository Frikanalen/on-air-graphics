import stylex from "@stylexjs/stylex"

const DevPageStyle = stylex.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#333",
  },
})
export const DevModePage = ({ children }: { children: React.ReactNode }) => (
  <div {...stylex.props(DevPageStyle.container)}>{children}</div>
)
