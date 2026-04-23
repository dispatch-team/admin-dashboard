import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.tsx"],
    globals: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@test": path.resolve(__dirname, "./tests"),
    },
    coverage: {
      thresholds: {
        lines: 90,
        statements: 85,
      },
    },
  },
});
