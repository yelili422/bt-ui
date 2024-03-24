import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const proxy_target =
    mode === "development" ? "http://localhost:8081" : process.env.PROXY_TARGET;

  return {
    server: {
      proxy: {
        "/api": {
          target: proxy_target,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    plugins: [react()],
  };
});
