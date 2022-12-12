/// <reference types="vitest" />

import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname)}/`,
      '@/': `${path.resolve(__dirname, 'src')}/`,
      '#/': `${path.resolve(__dirname, 'src/types')}/`,
    },
  },

  test: {
    include: ['test/**/*.test.ts'],
    // includeSource: ['src/**/*.{js,ts}'],
    environment: 'jsdom',
    /* use global to avoid globals imports (describe, test, expect): */
    globals: true,
  },
})
