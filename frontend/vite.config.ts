import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
//export default defineConfig({
//  plugins: [react()],
//})
export default defineConfig({
  plugins: [react()],
  build: {
    // 出力先を Laravel の public フォルダ「直下」に変更
    outDir: path.resolve(__dirname, '../backend/public'),
    // ビルド時に古いファイルを一度クリアする（ただし index.php などが消えないよう注意。必要に応じて調整）
    emptyOutDir: false, 
  },
})