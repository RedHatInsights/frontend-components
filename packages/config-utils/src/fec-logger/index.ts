import chalk from 'chalk';

const PREFIX = '[fec]';
const ERROR_LEVEL = `${PREFIX} Error`;
const WARN_LEVEL = `${PREFIX} Warn`;
const INFO_LEVEL = `${PREFIX} Info`;
const DEBUG_LEVEL = `${PREFIX} Debug`;

export enum LogType {
  error = ERROR_LEVEL,
  warn = WARN_LEVEL,
  info = INFO_LEVEL,
  debug = DEBUG_LEVEL,
}

const colors = {
  [LogType.error]: chalk.red,
  [LogType.warn]: chalk.yellow,
  [LogType.info]: chalk.blue,
  [LogType.debug]: chalk.magenta,
};

const logFunctions = {
  [LogType.error]: console.error,
  [LogType.warn]: console.warn,
  [LogType.info]: console.info,
  [LogType.debug]: console.debug,
};

function getFecMessage(level: LogType, ...data: any[]) {
  logFunctions[level](`${colors[level](level)}: `, ...data);
}

export default getFecMessage;
