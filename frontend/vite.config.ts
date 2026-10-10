import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // ここに開発用のサーバー（プロキシ）設定を追加します！
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Laravelのバックエンド（ポート8000）に転送する
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: path.resolve(__dirname, '../web/public'),
    emptyOutDir: false,
  },
})