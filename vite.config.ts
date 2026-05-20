import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Chapter 99 Operations",
        short_name: "Chapter99",
        description: "Luxury tour operations, CRM, safety, and compliance console.",
        theme_color: "#050505",
        background_color: "#050505",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.+\.supabase\.co\/rest\/v1\/.*$/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-rest-cache",
              networkTimeoutSeconds: 6,
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/.+\.supabase\.co\/functions\/v1\/.*$/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-functions-cache",
              networkTimeoutSeconds: 6,
              expiration: {
                maxEntries: 40,
                maxAgeSeconds: 30 * 60
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/.+\.supabase\.co\/storage\/v1\/object\/.*$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "supabase-storage-cache",
              expiration: {
                maxEntries: 120,
                maxAgeSeconds: 7 * 24 * 60 * 60
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: "module"
      }
    })
  ]
});
