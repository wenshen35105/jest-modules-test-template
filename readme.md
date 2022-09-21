# Template repo for e2e modules/components testing based on Jest, Typescript

## Features

- Each test module can be shipped individually. You only need to package the test modules and their lib modules
- Test Modules are allowed to use shared utilities from a lib module
- Test assets for each test module are independent
- No compilation is required, but validation by using "tsc" is still supported
- Easily run/debug tests

## To Start

1. Open [project.code-workspace](./project.code-workspace) by VSC
2. Run `yarn` from project root
3. From VSC, install the "Workspace recommendations" plugins
   1. The recommendation section might not show until you typed in `@recommended` from the search bar

## Folder structures

There're two test modules from the tree diagram below, where module-a and module-b are both referencing the core, jest lib modules.

If one only needs to ship tests from module-a, only the module-a and the lib modules that the test module depends on will be packaged.

```plain
/
├─ Dockerfile
├─ lerna.json
├─ modules
│  ├─ lib
│  │  ├─ core
│  │  │  ├─ config.yml
│  │  │  ├─ package.json
│  │  │  ├─ src
│  │  │  └─ tsconfig.json
│  │  ├─ module-a
│  │  │  ├─ package.json
│  │  │  ├─ src
│  │  │  │  ├─ api
│  │  │  │  │  └─ index.ts
│  │  │  │  └─ pageObj
│  │  │  └─ tsconfig.json
│  │  └─ module-b
│  │     ├─ package.json
│  │     ├─ src
│  │     │  ├─ api
│  │     │  │  └─ index.ts
│  │     │  └─ pageObj
│  │     └─ tsconfig.json
│  └─ test
│     ├─ module-a
│     │  ├─ assets
│     │  ├─ jest.config.ts
│     │  ├─ package.json
│     │  ├─ src
│     │  │  ├─ api
│     │  │  │  └─ api.test.ts
│     │  │  └─ ui
│     │  │     ├─ base
│     │  │     │  └─ uiTestBase.ts
│     │  │     └─ ui.test.ts
│     │  └─ tsconfig.json
│     ├─ module-b
│     │  ├─ asset
│     │  ├─ jest.config.ts
│     │  ├─ package.json
│     │  ├─ src
│     │  │  └─ api
│     │  │     └─ module-b.test.ts
│     │  └─ tsconfig.json
│     └─ types
│        └─ global.d.ts
├─ package.json
├─ project.code-workspace
└─ tsconfig.json
```

## Best practices

- High-level abstraction code should be separated from the testing modules and put into a lib module
  - e.x. API calls for a specific module, Selenium page objects of a module...
  - You are not encouraged to link two @lib modules (except @lib/core)
    - Module circular reference isn't allowed (@lib/module-a references @lib/module-b, and @lib/module-b references @lib/module-a)
    - You can glue the usage of modules from the test module based on your test scenario or create another lib module
- Assets for tests should always be kept in test modules but not in the lib modules
- Run "yarn validate" to check if your changes break another module before committing
- Categorize your tests within a test module. E.x UI tests or API tests

## Scripts

### Project root

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
- `yarn lint:prettier:check`
  - Prettier check
- `yarn lint:prettier:fix`
  - Prettier write

## Creating a new module

1. Create a new module folder under `modules/lib` or `modules/test` depending on the module type
2. Create a package.json
   1. Create a validate script
   2. Create a test script if it's a test module
3. Create a tsconfig.json and extends the project root tsconfig.json
   1. Create reference to the other modules that will be used
4. Edit [project.code-workspace](./project.code-workspace) so that your team members can sync up the workspace settings
   1. Add the new module under the "folders" section
   2. Add the module under the "jest.disabledWorkspaceFolders" section if the module is a lib module

## Docker

There's only one [Dockerfile](Dockerfile) from the project, but the single Dockerfile can use for shipping multiple modules by using the docker target feature.

```bash
docker build -t module-a-docker --target module-a .
```

The command above will build out an image that includes tests from module-a only.

To run the image simply just run `docker run module-a-docker`
