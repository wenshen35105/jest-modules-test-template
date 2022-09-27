# Template repo for e2e modules/components testing based on Jest, Typescript

## Getting started 🚪

### Install

1. Open [project.code-workspace](./project.code-workspace) by VSC
2. Run `yarn` from project root
3. From VSC, install the "Workspace recommendations" plugins
   1. The recommendation section might not show until you typed in `@recommended` from the search bar

### Scripts

#### Project root

- `yarn test`
  - Test all the modules from the project in parallel
- `yarn workspace @test/module-a test`
  - Test a specific module
- `yarn workspace @test/module-a test ./modules/module-a/src/test/bvt`
  - Run all tests of a module's folder
- `yarn workspace @test/module-a test ./modules/module-a/src/test/bvt/module-a.test.ts`
  - Test a specific file from a module
- `TEST_GROUPS="selenium rest" yarn workspace @test/module-a test`
  - Test by groups (Split groups by space)
- `yarn validate`
  - Although there's no need to run builds manually for tests in module, tsc is still helpful for helping to catch syntax errors of the tests
- `yarn lint:prettier:check`
  - Prettier check
- `yarn lint:prettier:fix`
  - Prettier write
- `yarn module:create`
  - create a new lib/test module
- `yarn workspace:sync`
  - synchronize vsc config based on modules

## High-Level Understanding 👀

### Features

- Each test module can be shipped individually. You only need to package the test modules and their lib modules
- Test Modules are allowed to use shared utilities from a lib module
- Test assets for each test module are independent
- No compilation is required, but validation by using "tsc" is still supported
- Easily run/debug tests

### Folder structures

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

## Test

### Jest

Each test module has a Jest config file which means they are independent to each other. By default configurations for each test module is genearted from the @lib/core module (Check [config.ts](./modules/lib/core/src/jest/config.ts)).

### Timeout

Default test timeout is increased to 8s for non-UI tests and 2mins for UI tests. You can customize timeout within a test or by using the group notion.

### Group

Test group is supported by adding a docblock from the top of the test file. Check the command above for filtering tests by groups. You can also create a default timeout for a group of tests by adding a new row into the section .jest.timeoutGroup in [@lib/core/config.yml](./modules/lib/core/config.yml)

A HTML report (experimental) will be generated for helping to analyze the failures based on group.

Below is how you will specify a group for a test.

```ts
/**
* @group selenium
*/

<code goes here>
```

### Selenium

Selenium utility is integrated with the "@lib/selenium" module by default. Specify a "selenium" group or use the "@selenium" tag as the example below for injecting `webDriver` into the test. You can control when webDriver should be re-created for a test by changing the "webDriverCycle" value. When the value equals "test", it means `webDriver` will be re-created for each "test" block and vice verse. Check the script snippet below.

Testers usually don't need to download the webDriver binaries manually as they are installed when doing the yarn installation. Testers are still allowed to pick up different webDriver binaries by changing the .selenium.webDriversDir from the config.

The repository extends the Jest.expect with some utilities from webDriver. Check the script snippet below.

```js
/**
* @group selenium
*
* or
*
* @selenium { "webDriverCycle": "test" }
*/

<code goes here>
...

// Expect the webDriver/webElement to have a child element
expect(WebDriver | WebElement).toHaveElementBy(By)

// This is based on: https://github.com/americanexpress/jest-image-snapshot
// but the image is resized and compressed for allowed to be uploaded to Github
//
// It takes a screenshot as a Jest snapshot by using webDriver/webElement
// For the next run if the screenshot output is different, the expect function 
// will raise a failure
expect(WebDriver | WebElement).toMatchSeleniumSnapshot();
```

### More Capabilities

There're more configuration to be explored from [@lib/core/config.yml](./modules/lib/core/config.yml) for assisting the testing experience.

## Best practices 💦

- High-level abstraction code should be separated from the testing modules and put into a lib module
  - e.x. API calls for a specific module, Selenium page objects of a module...
  - You are not encouraged to link two @lib modules (except @lib/core)
    - Module circular reference isn't allowed (@lib/module-a references @lib/module-b, and @lib/module-b references @lib/module-a)
    - You can glue the usage of modules from the test module based on your test scenario or create another lib module
- Assets for tests should always be kept in test modules but not in the lib modules
- Run "yarn validate" to check if your changes break another module before committing
- Group the tests
- Categorize your tests folder within a test module. E.x UI tests or API tests

## Package & Ship 📦

### Docker

There's only one [Dockerfile](Dockerfile) from the project, but the single Dockerfile can use for shipping multiple modules by using the docker target feature.

```bash
docker build -t module-a-docker --target module-a .
```

The command above will build out an image that includes tests from module-a only.

To run the image simply just run `docker run module-a-docker`
