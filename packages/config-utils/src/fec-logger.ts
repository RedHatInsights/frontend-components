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

function getFecMessage(level: LogType, message: string) {
  return `${colors[level](level)}: ${message}`;
}

export default getFecMessage;
module.exports = getFecMessage;
