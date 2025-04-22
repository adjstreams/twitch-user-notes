import eslintPluginPrettier from 'eslint-plugin-prettier';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ["coverage/**", "dist/**"]
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: eslintPluginPrettier
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'prettier/prettier': 'warn'
    }
  }
];
