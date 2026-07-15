import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/Job-Portal-Management-System/",
  plugins: [react()],
  server: { port: 5173 }
});
