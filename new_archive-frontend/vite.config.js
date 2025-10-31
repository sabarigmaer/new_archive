import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // `target` should be a JS/Browsers target (e.g. 'es2018' or 'esnext'),
    // not a filesystem path. Use `outDir` to write the built files to
    // another folder (for example the backend's `client` folder).
    target: 'esnext',
    outDir: '../new_archive-backend/client',
    emptyOutDir: true
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
