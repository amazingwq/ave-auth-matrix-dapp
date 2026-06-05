import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        app: resolve(import.meta.dirname, "index.html"),
        deploy: resolve(import.meta.dirname, "deploy.html"),
        deploy36: resolve(import.meta.dirname, "deploy-36.html"),
        whitelist: resolve(import.meta.dirname, "whitelist.html"),
        low: resolve(import.meta.dirname, "low.html"),
        unknown: resolve(import.meta.dirname, "unknown.html"),
        caution: resolve(import.meta.dirname, "caution.html"),
        danger: resolve(import.meta.dirname, "danger.html"),
        blacklist: resolve(import.meta.dirname, "blacklist.html")
      }
    }
  }
});
