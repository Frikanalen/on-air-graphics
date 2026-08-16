import { defineConfig } from "vitest/config"

/*
 * The planning core is pure, so the tests need no DOM and no React plugin --
 * esbuild handles the JSX in segments.tsx on its own, and nothing here renders.
 */
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    environment: "node",
  },
})
