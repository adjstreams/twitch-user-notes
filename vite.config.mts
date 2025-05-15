// vite.config.ts
import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  root: "src",
  publicDir: "../public",
  plugins: [
    tsconfigPaths(),
    viteStaticCopy({
      targets: [
        { src: "../public/manifest.json", dest: "." },
        { src: "../public/icons", dest: "." }
      ]
    })
  ],
  server: {
    open: "/options/options.html",
    port: 5173
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    modulePreload: { polyfill: false },
    rollupOptions: {
      input: {
        options: resolve(__dirname, "src/options/options.html"),
        popup: resolve(__dirname, "src/popup/popup.html"),
        background: resolve(__dirname, "src/background/background.ts"),
        content: resolve(__dirname, "src/content/content.ts")
      },
      output: {
        entryFileNames: ({ name }) =>
          ["background", "content"].includes(name ?? "")
            ? "[name].js"
            : "[name]/[name].js",
        chunkFileNames: "[name]/[name].js",
        assetFileNames: ({ name }) => {
          if (name?.includes("options")) return "options/[name][extname]";
          if (name?.includes("popup")) return "popup/[name][extname]";
          return "[name][extname]";
        }
      }
    }
  }
});
