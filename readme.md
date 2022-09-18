# Template repo for e2e modules/components testing based on Jest, Typescript

## Features

- Each test module can be shipped individually. You only need to package the test modules and their lib modules
- Test Modules are allowed to use shared utilities from a lib module
- Test assets for each test module are independent
- No compilation is needed, but validation by using "tsc" is still supported
- Test environments can be easily customized and inherited

## Folder structures

There're two test modules from the tree diagram below, where module-a and module-b are both referencing the core, jest lib modules.

If one only needs to ship tests from module-a, only the module-a and its lib modules will be packaged.

```plain
/
├─ modules
│  ├─ lib
│  │  ├─ core
│  │  │  ├─ config.yml
│  │  │  ├─ package.json
│  │  │  ├─ src
│  │  │  │  └─ ...<utils>
│  │  │  └─ tsconfig.json
│  │  ├─ jest
│  │  │  ├─ package.json
│  │  │  ├─ src
│  │  │  │  └─ ...<utils>
│  │  │  └─ tsconfig.json
│  │  ├─ module-a
│  │  │  ├─ package.json
│  │  │  ├─ src
│  │  │  │  └─ ...<utils>
│  │  │  └─ tsconfig.json
│  │  ├─ module-b
│  │  │  ├─ package.json
│  │  │  ├─ src
│  │  │  │  └─ ...<utils>
│  │  │  └─ tsconfig.json
│  │  └─ types
│  └─ test
│     ├─ module-a
│     │  ├─ assets
│     │  ├─ jest.config.ts
│     │  ├─ package.json
│     │  ├─ src
│     │  │  └─ ...<tests>
│     │  └─ tsconfig.json
│     ├─ module-b
│     │  ├─ asset
│     │  ├─ jest.config.ts
│     │  ├─ package.json
│     │  ├─ src
│     │  │  └─ ...<tests>
│     │  └─ tsconfig.json
│     └─ types
└─ tsconfig.json
```

## Best practices

- Utility code (e.x. Selenium page objects, API calls...) should be separated from the testing code and put into a lib module
- Test assets should always be stored in test modules but not in the lib modules
- Always run the "yarn validate" script before committing changes
- Each module has a "package.json". Try to keep the dependencies that are used across different modules in the root "package.json"
- Shared types should be placed into either "modules/lib/types" or "modules/test/types"
- Enable ESLint (plugin) for your IDE/editor
- If a module contains UI and API tests, split the tests into two separate folders
- If a test needs to perform a pre-test behaviour, try to extract the common steps as a "jest environment"

## Scripts

- `yarn test`
  - Test all the modules from the project in parallel
- `yarn workspace @test/module-a test`
  - Test a specific module
- `yarn workspace @test/module-a test ./modules/module-a/src/test/bvt`
  - Run all tests of a module's folder
- `yarn workspace @test/module-a test ./modules/module-a/src/test/bvt/module-a.test.ts`
  - Test a specific file from a module
- `yarn validate`
  - Although there's no need to run builds manually for tests in module, tsc is still helpful for helping to catch syntax errors of the tests

## Docker

There's only one [Dockerfile](Dockerfile) from the project, but the single Dockerfile can use for shipping multiple modules by using the docker target feature.

```bash
docker build -t module-a-docker --target module-a .
```

The command above will build out an image that includes tests from module-a only.

To run the image simply just run `docker run module-a-docker`
