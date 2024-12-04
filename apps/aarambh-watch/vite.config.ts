import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';
import logResolvedPathsPlugin from './src/plugins/resolvedPathPlugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    react(),
    logResolvedPathsPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Your App Name',
        short_name: 'AppName',
        description: 'A brief description of your app',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        start_url: '.',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff'
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https?.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'network-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              },
            },
          },
        ],
      },
    })
  ],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@apis': path.resolve(__dirname, 'src/apis'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@types': path.resolve(__dirname, 'src/types'),


      "@atoms": path.resolve(__dirname, '../../packages/shared/atoms'),
      "@molecules": path.resolve(__dirname, '../../packages/shared/molecules'),
      "@organisms": path.resolve(__dirname, '../../packages/shared/organisms'),
      "@templates": path.resolve(__dirname, '../../packages/shared/templates'),
      "@shared/api": path.resolve(__dirname, '../../packages/shared/api'),
      "@shared/utils": path.resolve(__dirname, '../../packages/shared/utils'),
      "@shared/types": path.resolve(__dirname, '../../packages/shared/types'),
      "@shared/constants": path.resolve(__dirname, '../../packages/shared/constants'),
    },
  },
  optimizeDeps: { exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"] },
    server: {
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
        }
    }
})
