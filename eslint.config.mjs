import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default [
    ...tseslint.configs.recommended,
    {
        plugins: {
            "@next/next": nextPlugin,
            "react": reactPlugin,
            "react-hooks": hooksPlugin,
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs["core-web-vitals"].rules,
            "react/no-unescaped-entities": "off",
            "react/jsx-no-comment-textnodes": "warn",
            // Relax rules that are too strict for the existing codebase
            "@typescript-eslint/no-unused-vars": ["warn", {
                argsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_|^e$",
                varsIgnorePattern: "^_",
            }],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-require-imports": "warn",
            "@typescript-eslint/triple-slash-reference": "off",
        },
    },
    {
        ignores: [".next/", "node_modules/", "coverage/", "next-env.d.ts"],
    },
];
