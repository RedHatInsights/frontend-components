const chalk = require('chalk');

function logError(message) {
  console.log(chalk.blue('[fec]') + chalk.red(' ERROR: ') + message);
}

module.exports.logError = logError;
