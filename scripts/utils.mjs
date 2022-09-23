import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import fs, { readdirSync } from "fs";
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

  if (type === "lib") {
    createModuleDir(type, moduleName, "src");
  } else {
    createModuleDir(type, moduleName, "src", "api");
    createModuleDir(type, moduleName, "src", "ui");
    createModuleDir(type, moduleName, "src", "types");
    createModuleDir(type, moduleName, "assets");
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

export const createModuleDir = (type, moduleName, ...path) => {
  const modulePath = resolve(type === "lib" ? libDir : testDir, moduleName);
  const targetPath = resolve(modulePath, ...path);
  if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true });
  if (readdirSync(targetPath).length === 0) {
    fs.writeFileSync(resolve(targetPath, ".gitkeep"), "", "utf-8");
  }
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
  }

  fs.writeFileSync(
    resolve(modulePath, "package.json"),
    JSON.stringify(packageJsonTmpl),
    "utf-8"
  );
};

export const createJestConfig = (type, moduleName) => {
  console.log(`Creating jest.config for '@${type}/${moduleName}'`);

  if (type === "lib") return;
  const modulePath = resolve(testDir, moduleName);
  const tmpl = `
  import { getConfig } from "@lib/core/src/jest";
  import type { Config } from "jest";

  export default (): Config => getConfig(__dirname);
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
