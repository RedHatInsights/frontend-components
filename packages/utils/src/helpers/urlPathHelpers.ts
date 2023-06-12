/* eslint-disable import/prefer-default-export */
import { ChromeAPI } from '@redhat-cloud-services/types';

export const buildInsightsPath = (chrome: ChromeAPI, app: string, toProp: any) => {
  const inAppPath = (typeof toProp === 'object' ? toProp.pathname : toProp) || '';
  const isAbsolutePath = /^\//.test(inAppPath);
  const environmentPath = chrome.isBeta() ? '/preview' : '';
  const appPath = app || chrome.getApp();
  const pathname = isAbsolutePath ? [environmentPath, chrome.getBundle(), appPath, inAppPath.replace(/^\//, '')].join('/') : inAppPath;

  return typeof toProp === 'object'
    ? {
        ...toProp,
        pathname,
      }
    : pathname;
};
