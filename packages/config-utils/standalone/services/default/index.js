// These are the required services for insights-chrome to work.
const chrome = require('./chrome');
const config = require('./config');
const entitlements = require('./entitlements');
const landing = require('./landing');

module.exports = {
    chrome,
    config,
    entitlements,
    landing
};
