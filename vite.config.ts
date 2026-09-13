import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: [react(), tailwindcss(), ...(mode === "single" ? [viteSingleFile()] : [])],
  build: {
    target: "es2020",
    // In single-file mode the CV is inlined too, so the HTML stands alone.
    assetsInlineLimit: mode === "single" ? 220_000 : 4096,
    outDir: mode === "single" ? "dist-single" : "dist",
    cssCodeSplit: mode !== "single",
    rollupOptions:
      mode === "single"
        ? {}
        : { output: { manualChunks: { three: ["three"], vendor: ["react", "react-dom", "react-router-dom", "motion"] } } },
  },
}));
