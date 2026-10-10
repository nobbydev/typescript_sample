import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
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
    // 出力先を Laravel の public フォルダ「直下」に変更
    outDir: path.resolve(__dirname, '../web/public'),
    // ビルド時に古いファイルを一度クリアする（ただし index.php などが消えないよう注意。必要に応じて調整）
    emptyOutDir: false, 
  },
})