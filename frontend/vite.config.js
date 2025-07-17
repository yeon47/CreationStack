import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// 백엔드 API 프록시 설정
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 백엔드 주소
        changeOrigin: true,
      },
    },
  },
});
