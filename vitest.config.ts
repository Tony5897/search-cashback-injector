import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

// Kept separate from vite.config.ts to avoid the BUILD_TARGET guard
// that runs at module evaluation time.
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/lib/**/*.ts'],
    },
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
})
