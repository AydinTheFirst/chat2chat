import Generouted from "@generouted/react-router/plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), Generouted()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});

// DATABASE_URL=postgres://postgres:286ae5fe42e600ba8efc@easypanel.runocan.com:5446/aydinthefirst?sslmode=disable
