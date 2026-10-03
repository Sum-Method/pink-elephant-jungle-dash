import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: ["coverage/**", "dist/**", "docs/**", "node_modules/**", "public/**"],
  },
  js.configs.recommended,
  react.configs.flat.recommended,
  reactHooks.configs.flat.recommended,
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", ignoreRestSiblings: true, varsIgnorePattern: "^_" }],
    },
  },
];
