/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import istanbul from 'vite-plugin-istanbul'

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
      reporter: ['text', 'lcov', 'json'],
      reportsDirectory: 'coverage/unit',
      tempDirectory: '.nyc_output/unit'
    }
  }
})
