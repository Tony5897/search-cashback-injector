import { defineConfig, build, type Plugin } from 'vite'
import { resolve } from 'node:path'
import { cpSync, mkdirSync } from 'node:fs'

/**
 * After the background service worker is bundled, this plugin:
 *   1. Compiles the content script as a self-contained IIFE (no code-splitting).
 *   2. Copies manifest.json and icons into dist/.
 *
 * Running both targets from a single `vite build` call keeps the build script
 * simple while preserving the format difference MV3 requires: the background
 * service worker must be an ES module, content scripts must be classic scripts.
 */
function buildContentAndAssets(): Plugin {
  let hasRun = false
  return {
    name: 'build-content-and-assets',
    async closeBundle() {
      if (hasRun) return
      hasRun = true

      await build({
        configFile: false,
        resolve: {
          alias: { '@': resolve(__dirname, 'src') },
        },
        build: {
          outDir: 'dist',
          emptyOutDir: false,
          sourcemap: true,
          minify: false,
          target: 'esnext',
          rollupOptions: {
            input: resolve(__dirname, 'src/content/index.ts'),
            output: {
              format: 'iife',
              entryFileNames: 'content.js',
              inlineDynamicImports: true,
            },
          },
        },
      })

      cpSync('manifest.json', 'dist/manifest.json')
      mkdirSync('dist/icons', { recursive: true })
      cpSync('public/icons', 'dist/icons', { recursive: true })
    },
  }
}

export default defineConfig({
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    target: 'esnext',

    rollupOptions: {
      input: resolve(__dirname, 'src/background/index.ts'),
      output: {
        format: 'es',
        entryFileNames: 'background.js',
        inlineDynamicImports: true,
      },
    },
  },

  plugins: [buildContentAndAssets()],
})
