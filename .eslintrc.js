module.exports = {
    root: true,
    env: {
        es2021: true,
        node: true
    },
    extends: [
        "eslint:recommended",
    ],
    ignorePatterns: [
        "dist/**/*",
        "jest.config.ts"
    ],
    overrides: [
        {
            files: [
                "./modules/**/*.ts"
            ],
            extends: [
                "plugin:@typescript-eslint/recommended",
                "plugin:@typescript-eslint/recommended-requiring-type-checking",
            ],
            plugins: [
                "@typescript-eslint",
            ],
            parser: "@typescript-eslint/parser",
            parserOptions: {
                tsconfigRootDir: __dirname,
                project: [
                    "./tsconfig.json",
                    "./modules/lib/*/tsconfig.json",
                    "./modules/test/*/tsconfig.json"
                ]
            },
            rules: {
                "@typescript-eslint/no-unnecessary-type-assertion": "off"
            }
        },
        {
            files: [
                "modules/lib/*/src/**/*.ts"
            ],
            env: {
                "jest/globals": true
            },
            plugins: [
                "jest"
            ],
            extends: ["plugin:jest/recommended"],
            rules: {
                "jest/no-disabled-tests": "warn",
                "jest/no-focused-tests": "error",
                "jest/no-identical-title": "error",
                "jest/prefer-to-have-length": "warn",
                "jest/valid-expect": "error"
            }
        },
        {
            files: "**/*.ts",
            rules: {
                quotes: [
                    "error",
                    "double"
                ],
                semi: [
                    "error",
                    "always"
                ]
            }
        },
        {
            files: "**/*.d.ts",
            rules: {
                "no-var": "off"
            }
        }
    ],
    parserOptions: {
        sourceType: 'module',
    },
}