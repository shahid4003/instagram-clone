import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
	 build: {
    terserOptions: {
      compress: {
        drop_console: true,  // ✅ removes all console.log/error/warn in production
        drop_debugger: true, // optional: removes debugger statements
      },
    },
  },
});
