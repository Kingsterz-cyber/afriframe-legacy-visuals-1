import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTaggerPlugin } from "./src/visual-edits/component-tagger-plugin.js";

// Minimal plugin to log build-time and dev-time errors
const logErrorsPlugin = () => ({
  name: "log-errors-plugin",
  transformIndexHtml() {
    return {
      tags: [
        {
          tag: "script",
          injectTo: "head",
          children: `
            (() => {
              try {
                const obs = new MutationObserver(() => {
                  const el = document.querySelector('vite-error-overlay');
                  if (!el) return;
                  const text = el.shadowRoot?.textContent || el.textContent;
                  if (text) console.error('[Vite Overlay]', text.trim());
                });
                obs.observe(document.documentElement, { childList: true, subtree: true });
              } catch (e) {
                console.warn('[Overlay logger failed]', e);
              }
            })();
          `,
        },
      ],
    };
  },
});

export default defineConfig(({ mode }) => ({
  /** 🔴 REQUIRED FOR GITHUB PAGES */
  base: "/afriframe-legacy-visuals-1/",

  server: {
    host: "::",
    port: 3000,
  },

  plugins: [
    react(),
    logErrorsPlugin(),
    mode === "development" && componentTaggerPlugin(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
