import stylex from "@stylexjs/stylex"

const DevButtonStyles = stylex.create({
  button: {
    background: "#333",
    color: "#ddd",
    fontWeight: "bold",
    border: "none",
    padding: "0.5em 1em",
    fontFamily: "monospace",
    cursor: "pointer",
    ":hover": {
      background: "#444",
    },
    ":active": {
      background: "#555",
    },
  },
})
export const Button = ({
  onClick,
  children,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  children: React.ReactNode
}) => (
  <button {...stylex.props(DevButtonStyles.button)} onClick={onClick}>
    {children}
  </button>
)
