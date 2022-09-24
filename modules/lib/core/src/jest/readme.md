### Jest Runtime Lifecycle:

1. globalSetup.ts (Run scope)
   1. Initialize test module dependencies (e.g. setup folders)
2. runner.ts (Run scope)
   1. Filter target tests
   2. Update webdriver files
3. environment.ts (Test scope)
   1. inject global variables
   2. webdriver
      1. create/destory
      2. take screenshot
4. setTimeout (Test scope)
   1. Set timeout for each test file

* Test scope means all tests in one test file
