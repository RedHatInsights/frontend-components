import path from 'path';
import defaultServices from '../services/default';

// In: docker args array [string]
// Out: [number] | null
export function getExposedPorts(args: string | string[]) {
  if (!Array.isArray(args)) {
    return null;
  }
  const portArg: string | undefined = args
    .filter((arg) => typeof arg === 'string')
    .map((arg) => arg.trimStart())
    .find((arg) => arg.startsWith('-p'));
  if (portArg) {
    const matches = Array.from(portArg.matchAll(/(\d+):/g));
    if (matches.length > 0) {
      return matches.map((match) => Number(match[1])).filter((port) => !isNaN(port));
    }
  }

  return null;
}

export function getExposedPort(args: any | any[]) {
  const ports = getExposedPorts(args);
  if (ports) {
    return ports[0];
  }

  return null;
}

export function isGitUrl(pathOrUrl: string) {
  return /(https?:\/\/|git@)/.test(pathOrUrl);
}

export function resolvePath(reposDir: string, pathOrUrl: string) {
  const split = pathOrUrl.split('/');
  return isGitUrl(pathOrUrl) ? path.join(reposDir, split[split.length - 1]) : pathOrUrl;
}

// FIXME: Find out what is the standalone object shape
// standalone: boolean | object
export function getConfig(standalone: boolean | Record<string, any>, localChrome?: string, env?: string, port?: number) {
  const res: { [key: string]: any } = typeof standalone === 'object' ? standalone : defaultServices;

  // Resolve functions that depend on env or port
  Object.keys(res || {})
    .filter((key) => typeof res[key] === 'function')
    .forEach((key) => (res[key] = res[key]({ env, port })));

  // Respect localChrome
  if (localChrome && typeof standalone === 'object') {
    standalone.chrome.path = localChrome;
  }

  // Don't start keycloak if not replacing keycloakUri in chrome.js
  if (res.chrome && !res.chrome.keycloakUri.includes('localhost')) {
    delete res.chrome.services;
  }

  return res;
}

export const NET = 'clouddot_net';
