import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const target = process.env['BUILD_TARGET']

if (target !== 'background' && target !== 'content') {
  throw new Error(
    `BUILD_TARGET must be "background" or "content", got: "${String(target)}"`,
  )
}

const isBackground = target === 'background'

export default defineConfig({
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },

  build: {
    outDir: 'dist',
    // The background build runs first and clears dist/.
    // The content build runs second and adds to it.
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

  plugins: isBackground
    ? []
    : [
        viteStaticCopy({
          targets: [
            // Copy manifest.json from repo root → dist/
            { src: 'manifest.json', dest: '.' },
            // Copy icon assets → dist/icons/
            { src: 'public/icons', dest: '.' },
          ],
        }),
      ],
})
