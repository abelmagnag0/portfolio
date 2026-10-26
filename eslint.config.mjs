import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".next-container/**",
      "out/**",
      "build/**",
      "dist-api/**",
      "next-env.d.ts",
      // Handlers das Lambdas (Node.js, não fazem parte do app Next)
      "backend/**",
    ],
  },
];

export default eslintConfig;
