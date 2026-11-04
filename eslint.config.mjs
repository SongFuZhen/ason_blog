import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
})

// eslint-config-next's first flat config registers the `jsx-a11y` plugin.
// Declaring the same plugin in another config object makes ESLint 9 throw
// "Cannot redefine plugin jsx-a11y", so merge the project rule into that object.
const nextConfigs = nextCoreWebVitals.map((config, index) =>
  index === 0
    ? {
        ...config,
        rules: {
          ...config.rules,
          'jsx-a11y/anchor-is-valid': [
            'error',
            {
              components: ['Link'],
              specialLink: ['hrefLeft', 'hrefRight'],
              aspects: ['invalidHref', 'preferButton'],
            },
          ],
        },
      }
    : config
)

const config = [
  {
    ignores: ['node_modules/**', '.next/**', '.contentlayer/**', 'public/**'],
  },
  js.configs.recommended,
  // eslint-config-next 16 ships native flat configs; loading it through
  // FlatCompat.extends('next') crashes ESLint 9 with a circular-structure error.
  // Spread the flat config directly instead. core-web-vitals already includes
  // the base `next` config (react, react-hooks, import, jsx-a11y, @next/next
  // and @typescript-eslint), so no extra @typescript-eslint / jsx-a11y extends.
  ...nextConfigs,
  ...compat.extends('plugin:prettier/recommended'),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.amd,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },

    rules: {
      'prettier/prettier': 'error',
      'no-undef': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unused-vars': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
  {
    // 配置文件使用 CommonJS（require / module.exports），需允许 require 导入。
    files: [
      'next.config.js',
      'postcss.config.js',
      'prettier.config.js',
      'tailwind.config.js',
      '*.config.cjs',
    ],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]

export default config
