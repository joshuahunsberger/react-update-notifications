import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const REPO_NAME = "react-update-notifications";

// https://vite.dev/config/
export default defineConfig({
  base: `/${REPO_NAME}/`,
  plugins: [
    react(),
    VitePWA({
      // 2. Use 'prompt' strategy
      registerType: "prompt",

      // 3. No manifest needed for this demo
      manifest: false,

      // 4. Don't run in dev mode
      devOptions: {
        enabled: false,
      },

      workbox: {
        // 5. This ensures all assets are included
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
});
