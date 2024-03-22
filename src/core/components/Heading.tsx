import stylex from "@stylexjs/stylex"

const HeadingStyle = stylex.create({
  h1: {
    color: "#999",
  },
  h2: {
    color: "#999",
  },
})
export const Heading = ({
  children,
  level,
}: {
  children: React.ReactNode
  level: 1 | 2
}) => {
  switch (level) {
    case 1:
      return <h1 {...stylex.props(HeadingStyle.h1)}>{children}</h1>
    case 2:
      return <h2 {...stylex.props(HeadingStyle.h2)}>{children}</h2>
    default:
      throw new Error("Invalid heading level")
  }
}
