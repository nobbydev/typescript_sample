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
    // 出力先を Laravel の public フォルダ内に指定
    outDir: path.resolve(__dirname, '../backend/public/build'),
    // ビルド時に古いファイルを一度クリアする
    emptyOutDir: true,
  },
})