import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: [
        path.resolve(__dirname, 'src/index.ts'),
      ],
      name: 'FlipCard',
      fileName: (format, entryName) => {
        return `v-flipcard.${format}.js`
      },
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['vue'],
      output: { globals: { vue: 'Vue' }, exports: 'named' }
    }
  }
})
