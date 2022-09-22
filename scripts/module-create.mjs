import inquirer from "inquirer";
import { isModuleExist } from "./utils.mjs";

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
    });
  // const moduleName = await inquirer.prompt([
  //   {
  //     type: "input",
  //     name: "moduleName",
  //     message: "what is the module name?",
  //     validate(val) {
  //       if (!val) {
  //         return "Please enter a valid module name";
  //       }
  //       if (isModuleExist(moduleType, val)) {
  //         return "Module existed";
  //       }
  //       return true;
  //     },
  //   },
  // ])["moduleName"];
  // console.log(
  //   "🚀 ~ file: module-create.mjs ~ line 29 ~ moduleName",
  //   moduleName
  // );
})();
