/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import istanbul from 'vite-plugin-istanbul'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    istanbul({
      include: ['src/**/*.{js,ts,vue}'],
      exclude: ['src/components/icons/**/*.{js,ts,vue}'],
      extension: ['.js', '.ts', '.vue'],
      requireEnv: false
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./tests', import.meta.url))
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'tests/unit/setup.js',
    coverage: {
      all: true,
      provider: 'istanbul',
      enabled: true,
      include: ['src/**/*.{js,ts,vue}'],
      exclude: ['src/components/icons/**/*.{js,ts,vue}'],
      extension: ['.js', '.ts', '.vue'],
      requireEnv: false,
      reporter: ['text', 'text-summary', 'lcov', 'json'],
      reportsDirectory: 'coverage/unit',
      tempDirectory: '.nyc_output/unit'
    }
  }
})
