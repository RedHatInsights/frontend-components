const path = require('path');
const defaultServices = require('../services/default');

// In: docker args array [string]
// Out: [number] | null
function getExposedPorts(args) {
  if (!Array.isArray(args)) {
    return null;
  }
  const portArg = args
    .filter(arg => typeof arg === 'string')
    .map(arg => arg.trimStart())
    .find(arg => arg.startsWith("-p"));
  if (portArg) {
    const matches = Array.from(portArg.matchAll(/(\d+):/g));
    if (matches.length > 0) {
      return matches.map(match => Number(match[1])).filter(port => !isNaN(port));
    }
  }

  return null;
}

function getExposedPort(args) {
  const ports = getExposedPorts(args);
  if (ports) {
    return ports[0];
  }

  return null;
}

function isGitUrl(pathOrUrl) {
  return /(https?:\/\/|git@)/.test(pathOrUrl);
}

function resolvePath(reposDir, pathOrUrl) {
  const split = pathOrUrl.split('/');
  return isGitUrl(pathOrUrl)
    ? path.join(reposDir, split[split.length - 1])
    : pathOrUrl;
}

// standalone: boolean | object
function getConfig(standalone, localChrome, env, port) {
  let res = typeof standalone === 'object' ? standalone : defaultServices;

  // Resolve functions that depend on env or port
  Object.keys(res || {})
    .filter(key => typeof res[key] === 'function')
    .forEach(key => res[key] = res[key]({ env, port }));

  // Respect localChrome
  if (localChrome) {
    standalone.chrome.path = localChrome;
  }

  // Don't start keycloak if not replacing keycloakUri in chrome.js
  if (res.chrome && !res.chrome.keycloakUri.includes('localhost')) {
    delete res.chrome.services;
  }

  return res;
}

module.exports = {
  NET: 'clouddot_net',
  getExposedPorts,
  getExposedPort,
  getConfig,
  isGitUrl,
  resolvePath
};
