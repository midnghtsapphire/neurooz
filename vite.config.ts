import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { SITE_BASE } from "./src/seo/site.ts";

// https://vitejs.dev/config/
export default defineConfig({
  // https://neurooz.com is the site root on Cloudflare Pages and on the droplet.
  base: SITE_BASE,
  build: {
    // Content hashes let Cloudflare and nginx cache JS/CSS for a long time.
    // index.html stays the short-lived entry. See public/_headers and nginx.conf.
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "happy-dom",
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/modules/**/*.ts", "src/utils/**/*.ts"],
    },
  },
});
