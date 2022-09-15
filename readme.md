# Template repo for modules testing based on Jest, Typescript

### Features

- Each test module can be shipped individually
- Build only the module you will need
- Faster build time and easy to build
- Test modules are allowed to use utilities from a shared-module
- Trigger sub-set of tests within each module can be easy
- EsLint enabled

### Folder structures

There're two test modules from the tree diagram below, where module-a and module-b are both referencing the core module. 

If one only needs to ship/build/run tests from module-a, only the module-a and the core modules will be built out by running the command: `yarn lerna run build --scope @jest-modules-test-template/module-a`.

Jest tests are expected to be placed by the following paths `modules/<module_name>/src/test/<scope>`

```
/
├─ modules/
│  ├─ core/
│  │  ├─ tsconfig.json
│  │  ├─ src/
│  ├─ module-a/
│  │  ├─ src/
│  │  │  ├─ test/
│  │  │  │  ├─ bvt/
│  │  │  │  ├─ <tests for the other scopes...>/
│  │  ├─ tsconfig.json
│  ├─ module-b/
│  │  ├─ src/
│  │  │  ├─ test/
│  │  │  │  ├─ bvt/
│  │  │  │  ├─ <tests for the other scopes...>/
│  │  ├─ tsconfig.json
├─ tsconfig.json
├─ dist/
```

### Commands

- `yarn build`
  - Build all the modules from the project in parallel
- `yarn test`
  - Test all the modules from the project in parallel
- `yarn lerna run build --scope @jest-modules-test-template/module-a`
  - Build a specific module from the project
- `yarn lerna run test --scope @jest-modules-test-template/module-a`
  - Test a specific module from the project

### Docker

There's only one [Dockerfile](Dockerfile) from the project, but the single Dockerfile can use for building out multiple modules by using the docker target feature. 

```
docker build -t module-a-docker:latest --target module-a .
```

The command above will build out an image that includes tests from module-a only.

To run the image simply just run `docker run module-a-docker:latest`

Or if you need to specify the scope `docker run --env TEST_SCOPES='bvt' module-a-docker:latest`