# Template repo for modules testing based on Jest, Typescript

### Features

- Each test module can be shipped individually
- Package only the test module you will need
- Modules are allowed to use utilities from a different shared-module
- Trigger sub-set of tests within each module can be easy
- Thanks for Jest preset and ts-jest, Typescript files used for the tests do not need to be compiled

### Folder structures

There're two test modules from the tree diagram below, where module-a and module-b are both referencing the core module. 

If one only needs to ship/run tests from module-a, only the module-a and the core modules will be packaged.

Jest tests are expected to be placed by the following paths `modules/<module_name>/src/test/<bundle>`

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
│  │  │  │  ├─ <other test bundles...>/
│  │  ├─ tsconfig.json
│  ├─ module-b/
│  │  ├─ src/
│  │  │  ├─ test/
│  │  │  │  ├─ bvt/
│  │  │  │  ├─ <other test bundles...>/
│  │  ├─ tsconfig.json
├─ tsconfig.json
├─ dist/
```

### Scripts

- `yarn test`
  - Test all the modules from the project in parallel
- `yarn lerna run test --scope @jest-modules-test-template/module-a`
  - Test a specific module
- `TEST_FILTERS='bvt' yarn lerna run test --scope @jest-modules-test-template/module-a`
  - Test a specific bundle from a module

### Docker

There's only one [Dockerfile](Dockerfile) from the project, but the single Dockerfile can use for shipping multiple modules by using the docker target feature. 

```
docker build -t module-a-docker --target module-a .
```

The command above will build out an image that includes tests from module-a only.

To run the image simply just run `docker run module-a-docker`

Or if you need to apply filters `docker run --env TEST_FILTERS='bvt' module-a-docker`