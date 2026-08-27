import { defineConfig, type PreviewServer, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'

const DEMO_REWRITES: Record<string, string> = {
  '/demo/mama-made-roti': '/demos/mama-made-roti/index.html',
  '/demo/mama-made-roti/': '/demos/mama-made-roti/index.html',
}

function salesDemoRewrites() {
  const apply = (server: ViteDevServer | PreviewServer) => {
    server.middlewares.use((req, _res, next) => {
      const path = req.url?.split('?')[0]
      if (path && DEMO_REWRITES[path]) {
        req.url = DEMO_REWRITES[path]
      }
      next()
    })
  }
  return {
    name: 'sales-demo-rewrites',
    configureServer: apply,
    configurePreviewServer: apply,
  }
}

export default defineConfig({
  base: '/',
  plugins: [react(), salesDemoRewrites()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          icons: ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
