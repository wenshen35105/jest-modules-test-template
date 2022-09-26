import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { execa } from "execa";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const rootDir = resolve(__dirname, "..");
export const libDir = resolve(rootDir, "modules", "lib");
export const testDir = resolve(rootDir, "modules", "test");

export const getLibModuleList = () => {
  return fs.readdirSync(libDir);
};

export const getTestModuleList = () => {
  return fs.readdirSync(testDir);
};

export const getProjRootPackageJson = () => {
  return JSON.parse(fs.readFileSync(resolve(rootDir, "package.json"), "utf-8"));
};

export const isModuleExist = (type, moduleName) => {
  const moduleList = type === "lib" ? getLibModuleList() : getTestModuleList();
  return moduleList.includes(moduleName);
};

export const getPeerDependencies = (type, moduleName) => {
  const dir =
    type === "lib" ? resolve(libDir, moduleName) : resolve(testDir, moduleName);
  const deps =
    JSON.parse(fs.readFileSync(resolve(dir, "package.json"), "utf-8"))
      ?.peerDependencies || {};
  return deps;
};

export const createModule = async (type, moduleName) => {
  const modulePath = resolve(type === "lib" ? libDir : testDir, moduleName);

  let tmpl = "";
  if (type === "lib") {
    // module/src/index.ts
    tmpl = `
    export * as api from "./api";
    export * as pageObj from "./pageObj";
    `;
    createModuleFile(type, moduleName, "index.ts", tmpl, "src");

    // module/src/api/index.ts
    tmpl = `
    export {}
    `;
    createModuleFile(type, moduleName, "index.ts", tmpl, "src", "api");

    // module/src/pageObj/index.ts
    tmpl = `
    export * from "./mypageObj";
    `;
    createModuleFile(type, moduleName, "index.ts", tmpl, "src", "pageObj");

    // module/src/pageObj/myPageObj.ts
    tmpl = `
    import { PageObjBase } from "@lib/types";
    class MyPageObj implements PageObjBase {}
    export { MyPageObj }
    `;
    createModuleFile(type, moduleName, "mypageObj.ts", tmpl, "src", "pageObj");
  } else {
    // moudle/src/api/api.test.ts
    tmpl = "";
    createModuleFile(type, moduleName, "api.test.ts", tmpl, "src", "api");

    // module/src/ui/ui.test.ts
    tmpl = `
    /**
     * @group selenium
     */
    import { By } from "selenium-webdriver";

    describe("My Test", () => {
      test("page", async () => {
        await webDriver.get("https://ibm.com");
        await expect(webDriver).not.toHaveElementBy(
          By.xpath("//span[contains(text(), 'IBM')]")
        );
      });
    });
    `;
    createModuleFile(type, moduleName, "ui.test.ts", tmpl, "src", "ui");

    // module/src/types/global.d.ts
    tmpl = `
    import "@lib/core/src/types/lib";
    `;
    createModuleFile(type, moduleName, "lib.d.ts", tmpl, "src", "types");

    // module/assets/.gitkeep
    createModuleFile(type, moduleName, ".gitkeep", "", "assets");
  }

  createTsConfig(type, moduleName);
  createPackageJson(type, moduleName);
  createJestConfig(type, moduleName);
  await execa("yarn", { cwd: rootDir });
  await execa("yarn", ["prettier", modulePath, "--cache", "--write"], {
    cwd: rootDir,
  });
  await syncProjectCodeWorkspace();
};

export const createModuleDir = (type, moduleName, ...pathToFolder) => {
  const modulePath = resolve(type === "lib" ? libDir : testDir, moduleName);
  const targetPath = resolve(modulePath, ...pathToFolder);
  if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true });
};

export const createModuleFile = (
  type,
  moduleName,
  fileName = ".gitkeep",
  fileContent = "",
  ...pathToFolder
) => {
  const modulePath = resolve(type === "lib" ? libDir : testDir, moduleName);
  const targetPath = resolve(modulePath, ...pathToFolder, fileName);
  createModuleDir(type, moduleName, ...pathToFolder);
  fs.writeFileSync(targetPath, fileContent, "utf-8");
};

export const createTsConfig = (type, moduleName) => {
  console.log(`Creating tsconfig.json for '@${type}/${moduleName}'`);

  const modulePath = resolve(type === "lib" ? libDir : testDir, moduleName);
  const tsConfigTmpl = {
    extends: "../../../tsconfig.json",
    include: ["src/**/*"],
    compilerOptions: {
      outDir: `../../../dist/${type}/${moduleName}`,
      rootDir: ".",
    },
  };
  if (type === "test") {
    tsConfigTmpl.references = [
      {
        path: "../../lib/core",
      },
    ];
    tsConfigTmpl.include.push("jest.config.ts");
  } else if (type === "lib") {
    tsConfigTmpl.references = [
      {
        path: "../types",
      },
    ];
  }
  fs.writeFileSync(
    resolve(modulePath, "tsconfig.json"),
    JSON.stringify(tsConfigTmpl),
    "utf-8"
  );
};

export const createPackageJson = (type, moduleName) => {
  console.log(`Creating package.json for '@${type}/${moduleName}'`);

  const modulePath = resolve(type === "lib" ? libDir : testDir, moduleName);
  const packageJsonTmpl = {
    name: `@${type}/${moduleName}`,
    version: getProjRootPackageJson()?.version || "0.0.1",
    private: true,
    scripts: {
      validate: "yarn root:validate",
    },
  };

  if (type === "test") {
    packageJsonTmpl.scripts["test"] = "yarn core:test";
    packageJsonTmpl.dependencies = getPeerDependencies("lib", "core");
    packageJsonTmpl.dependencies["@lib/core"] = "workspace:^";
  } else if (type === "lib") {
    packageJsonTmpl.main = "src/index";
    packageJsonTmpl.dependencies = packageJsonTmpl.dependencies ?? {};
    packageJsonTmpl.dependencies["@lib/types"] = "workspace:^";
  }

  fs.writeFileSync(
    resolve(modulePath, "package.json"),
    JSON.stringify(packageJsonTmpl),
    "utf-8"
  );
};

export const createJestConfig = (type, moduleName) => {
  if (type === "lib") return;
  console.log(`Creating jest.config for '@${type}/${moduleName}'`);

  const modulePath = resolve(testDir, moduleName);
  const tmpl = `
  import { jest, types } from "@lib/core";

  export default (): types.jest.Config => jest.getConfig(__dirname);
  `;
  fs.writeFileSync(resolve(modulePath, "jest.config.ts"), tmpl, "utf-8");
};

export const syncProjectCodeWorkspace = async () => {
  console.log("Synchronizing project workspace setting");

  const file = resolve(rootDir, "project.code-workspace");
  const json = JSON.parse(fs.readFileSync(file, "utf-8"));
  const libModules = getLibModuleList().map((l) => `@lib/${l}`);
  const testModules = getTestModuleList().map((l) => `@test/${l}`);
  // set folders
  json.folders = ["root", ...libModules, ...testModules].map(
    (modulePackageName) => {
      let path = ".";
      if (modulePackageName !== "root") {
        const [type, name] = resolvePackageName(modulePackageName);
        path = `./modules/${type}/${name}`;
      }
      return { name: modulePackageName, path };
    }
  );
  // set jest.disabledWorkspaceFolders
  json.settings["jest.disabledWorkspaceFolders"] = ["root", ...libModules];
  // writing back
  fs.writeFileSync(file, JSON.stringify(json), "utf-8");
  // call prettier
  console.log("Calling yarn...");
  await execa(
    "yarn",
    ["prettier", file, "--cache", "--write", "--parser", "json"],
    {
      cwd: rootDir,
    }
  );
  return execa("yarn", { cwd: rootDir });
};

export const resolvePackageName = (modulePackageName) => {
  const name = modulePackageName.split("/")[1];
  const type = modulePackageName.split("/")[0].split("@")[1];
  return [type, name];
};
