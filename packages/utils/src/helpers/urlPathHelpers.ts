import { LinkProps } from 'react-router-dom';
import { ChromeAPI } from '@redhat-cloud-services/types';

export const buildInsightsPath = (chrome: ChromeAPI, app: string, toProp: LinkProps['to'], forcePreview?: boolean): LinkProps['to'] => {
  const inAppPath = (typeof toProp === 'object' ? toProp.pathname : toProp) || '';
  const isAbsolutePath = /^\//.test(inAppPath as string);
  const environmentPath = forcePreview ? '/preview' : '';
  const appPath = app || chrome.getApp();
  const pathname = isAbsolutePath ? [environmentPath, chrome.getBundle(), appPath, (inAppPath as string).replace(/^\//, '')].join('/') : inAppPath;

  // @ts-ignore
  return typeof toProp === 'object'
    ? {
        ...toProp,
        pathname,
      }
    : pathname;
};
