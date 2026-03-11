import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

// Kept separate from vite.config.ts to avoid the BUILD_TARGET guard
// that runs at module evaluation time.
export default defineConfig({
  test: {
    // Current tests cover pure utility functions — no DOM needed.
    // Add @vitest-environment happy-dom to individual test files when DOM is required.
    environment: 'node',
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
