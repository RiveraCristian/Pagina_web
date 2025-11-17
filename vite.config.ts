import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { adminApiPlugin } from './vite-plugin-admin-api'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    adminApiPlugin({
      dataDir: path.resolve(__dirname, './src/data'),
      uploadsDir: path.resolve(__dirname, './public/images/uploads'),
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
