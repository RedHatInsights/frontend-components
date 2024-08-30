import chalk from 'chalk';

const PREFIX = '[fec]';
const ERROR_LEVEL = 'Error';
const WARN_LEVEL = 'Warn';
const INFO_LEVEL = 'Info';
const DEBUG_LEVEL = 'Debug';

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
  logFunctions[level](`${colors[level](PREFIX + ' ' + level)}: `, ...data);
}

export const fecWebpackLogger = () => {
  function cleanUpLog(args: any) {
    return args.map((log: any) => {
      if (typeof log === 'string') {
        return log.replace('[webpack-dev-server]', '').trim();
      } else {
        return log;
      }
    });
  }

  function log(level: LogType, ...data: any[]) {
    logFunctions[level](`${colors[level]('[wds] ' + level)}: `, ...data);
  }

  return {
    ...console,
    error: (...args: any[]) => log(LogType.error, chalk.bold.red(...cleanUpLog(args))),
    warn: (...args: any[]) => log(LogType.warn, ...cleanUpLog(args)),
    info: (...args: any[]) => log(LogType.info, ...cleanUpLog(args)),
    debug: (...args: any[]) => log(LogType.debug, ...cleanUpLog(args)),
    log: (...args: any[]) => log(LogType.debug, ...cleanUpLog(args)),
  };
};

export default getFecMessage;
module.exports = getFecMessage;
module.exports.LogType = LogType;
module.exports.fecWebpackLogger = fecWebpackLogger;
