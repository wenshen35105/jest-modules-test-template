import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import fs, { readdirSync } from "fs";

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

export const createModule = (type, moduleName) => {
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
};

export const createModuleDir = (type, moduleName, ...path) => {
  const modulePath = resolve(type === "lib" ? libDir : testDir, moduleName);
  const targetPath = resolve(modulePath, ...path);
  if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true });
  if (readdirSync(targetPath).length === 0) {
    fs.writeFileSync(resolve(targetPath, ".gitignore"), "", "utf-8");
  }
};

export const createTsConfig = (type, moduleName) => {
  console.log(`Creating package.json for '@${type}/${moduleName}'`);

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
      validate: "tsc --build .",
    },
  };

  if (type === "test") {
    packageJsonTmpl.scripts["test"] = "jest";
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
  const modulePath = resolve(type === "lib" ? libDir : testDir, moduleName);
  const tmpl = ```
  import { getConfig } from "@lib/core/src/jest";
  import type { Config } from "jest";

  export default (): Config => getConfig(__dirname);
  ```;
  fs.writeFileSync(resolve(modulePath, "jest.config.ts"), tmpl, "utf-8");
};
