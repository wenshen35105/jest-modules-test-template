/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import util from "util";
import chalk from "chalk";

const LOG_PREFIX = chalk.bgWhite.black("*") + " ";

export const info = (format: any, ...params: any[]) => {
  const message = util.format(format, ...params);
  console.log(chalk.bold(LOG_PREFIX + message));
};

export const error = (format: any, ...params: any[]) => {
  const message = util.format(format, ...params);
  console.log(chalk.bgRed.white(LOG_PREFIX + message));
};
