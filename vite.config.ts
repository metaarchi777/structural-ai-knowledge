import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  // GitHub Pages는 https://{user}.github.io/{repo}/ 에서 서비스되므로
  // CI에서 VITE_BASE_PATH=/{repo}/ 로 지정해 빌드합니다 (로컬 개발 시엔 '/').
  base: process.env.VITE_BASE_PATH ?? "/",
  server: {
    port: 3000,
    strictPort: false,
    host: true,
  },
});
