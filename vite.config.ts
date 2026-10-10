/**
 * @file vite.config.ts
 * @description Vite + Vitest config for nzpolitik
 * @onboarding
 * - App entry: index.html -> src/main.tsx
 * - GITHUB_PAGES=true sets base /nzpolitik/ for GitHub project Pages
 * - Tests use jsdom; run with npm test
 * - Dependencies: vite, @vitejs/plugin-react, vitest
 * @see src/main.tsx for app bootstrap
 */
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const pagesBase = process.env.GITHUB_PAGES === "true" ? "/nzpolitik/" : "/";

export default defineConfig({
  base: pagesBase,
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
