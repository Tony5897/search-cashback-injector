// @ts-check
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,

  // Parser options for type-aware rules
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Source files: browser + WebExtension globals
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.webextensions,
      },
    },
    rules: {
      // Enforce import type for type-only imports (aligns with verbatimModuleSyntax)
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      // Catch unawaited promises — critical for chrome.* API calls
      '@typescript-eslint/no-floating-promises': 'error',
      // Allow void-returning async callbacks (e.g., MutationObserver, event handlers)
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: false },
      ],
    },
  },

  // Config and test files: disable type-aware rules (not in tsconfig project)
  {
    files: ['*.config.ts', '*.config.mjs', 'tests/**/*.ts'],
    ...tseslint.configs.disableTypeChecked,
  },

  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
)
