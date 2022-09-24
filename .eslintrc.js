module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    // https://github.com/prettier/eslint-plugin-prettier#recommended-configuration
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["dist/**/*", ".yarn/**"],
  overrides: [
    {
      files: ["./modules/**/*.ts"],
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      plugins: ["@typescript-eslint"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: [
          "./tsconfig.json",
          "./modules/lib/*/tsconfig.json",
          "./modules/test/*/tsconfig.json",
        ],
      },
      rules: {
        "@typescript-eslint/no-unnecessary-type-assertion": "off",
      },
    },
    {
      files: ["modules/test/*/src/**/*.ts"],
      env: {
        "jest/globals": true,
      },
      plugins: ["jest"],
      extends: ["plugin:jest/recommended"],
      rules: {
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error",
        "jest/require-top-level-describe": [
          "error",
          { maxNumberOfTopLevelDescribes: 1 },
        ],
        "jest/max-nested-describe": [
          "error",
          {
            max: 1,
          },
        ],
      },
    },
    {
      files: "**/*.d.ts",
      rules: {
        "no-var": "off",
      },
    },
  ],
  parserOptions: {
    sourceType: "module",
  },
};
