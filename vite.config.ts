import { defineConfig, type Plugin } from 'vite'
import { resolve } from 'node:path'
import { cpSync, mkdirSync } from 'node:fs'

const target = process.env['BUILD_TARGET']

if (target !== 'background' && target !== 'content') {
  throw new Error(
    `BUILD_TARGET must be "background" or "content", got: "${String(target)}"`,
  )
}

const isBackground = target === 'background'

/**
 * Copies manifest.json and icon assets into dist/ at the end of the content build.
 * Uses Node built-ins only — no external ESM-only dependency required.
 */
function copyExtensionAssets(): Plugin {
  return {
    name: 'copy-extension-assets',
    closeBundle() {
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
    // Background build runs first and clears dist/.
    // Content build runs second and adds to it.
    emptyOutDir: isBackground,
    sourcemap: true,
    minify: false,
    target: 'esnext',

    rollupOptions: isBackground
      ? {
          input: resolve(__dirname, 'src/background/index.ts'),
          output: {
            format: 'es',
            entryFileNames: 'background/index.js',
            // Keep the service worker self-contained — no dynamic chunks.
            inlineDynamicImports: true,
          },
        }
      : {
          input: resolve(__dirname, 'src/content/index.ts'),
          output: {
            // Content scripts cannot be ES modules — IIFE required.
            format: 'iife',
            entryFileNames: 'content/index.js',
            inlineDynamicImports: true,
          },
        },
  },

  plugins: isBackground ? [] : [copyExtensionAssets()],
})
