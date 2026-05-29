// @ts-check
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,

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
    },
  },

  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
)
