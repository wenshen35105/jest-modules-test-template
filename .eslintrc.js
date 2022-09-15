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
                "./modules/*/src/**/*.ts"
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
                    "./modules/*/tsconfig.json",
                ]
            },
        },
        {
            files: [
                "modules/*/src/test/**/*.ts"
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
            files: "./**/*.ts",
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
        }
    ]
}