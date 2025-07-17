import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";

export default [
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.commonjs,
        ...globals.es2022,
        _: true,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["**/*.jsx"],
    plugins: {
      react: pluginReact,
      import: pluginImport,
    },
    rules: {
      "no-console": "warn",
      "no-plusplus": "off",
      "no-shadow": "off",
      "vars-on-top": "off",
      "no-underscore-dangle": "off",
      "comma-dangle": "off",
      "func-names": "off",
      "prefer-template": "off",
      "no-nested-ternary": "off",
      "max-classes-per-file": "off",
      "consistent-return": "off",
      "no-restricted-syntax": ["off", "ForOfStatement"],
      "prefer-arrow-callback": "error",
      "require-await": "error",
      "arrow-parens": ["error", "as-needed"],
      "no-param-reassign": ["error", { "props": false }],
      "no-unused-expressions": [
        "error",
        {
          "allowTernary": true,
          "allowShortCircuit": true,
          "allowTaggedTemplates": true,
        },
      ],
      "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
      "max-len": [
        "error",
        {
          "code": 120,
          "ignoreComments": true,
          "ignoreStrings": true,
          "ignoreTemplateLiterals": true,
        },
      ],
      // React specific rules
      "react/react-in-jsx-scope": "off", // Not needed for React 17+
      "react/jsx-uses-react": "off", // Not needed for React 17+
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
