import * as stylex from "@stylexjs/stylex"
import { theme } from "../../theme.stylex.ts"

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
