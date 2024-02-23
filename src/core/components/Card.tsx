import * as stylex from "@stylexjs/stylex"
import { theme } from "../../theme.stylex.ts"
import { ComponentPropsWithoutRef, forwardRef } from "react"

// Define the basic card style
export const cardStyle = stylex.create({
  baseCard: {
    boxShadow: theme.shadowCard,
    padding: "24px",
    borderRadius: "8px",
    background: theme.colorCard,
    backdropFilter: "blur(30px)",
  },
})

/**
 * This is here for styled-component backwards compatibility.
 */
export const Card = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} {...stylex.props(cardStyle.baseCard)} {...props}>
        {children}
      </div>
    )
  },
)
