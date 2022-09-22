import inquirer from "inquirer";
import { isModuleExist, createModule } from "./utils.mjs";

(async () => {
  let moduleType;
  let moduleName;

  return inquirer
    .prompt([
      {
        type: "list",
        name: "moduleType",
        message: "What kind of module are you looking to add?",
        choices: ["lib", "test"],
      },
    ])
    .then((res) => {
      moduleType = res["moduleType"];
      return inquirer.prompt([
        {
          type: "input",
          name: "moduleName",
          message: "what is the module name?",
          validate(val) {
            if (!val) {
              return "Please enter a valid module name";
            }
            if (isModuleExist(moduleType, val)) {
              return "Module existed";
            }
            return true;
          },
        },
      ]);
    })
    .then((res) => {
      moduleName = res.moduleName;
      return createModule(moduleType, moduleName);
    });
})();
