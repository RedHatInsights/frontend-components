import { useScalprum } from '@scalprum/react-core';
import { QuickStartCatalogPage } from '@patternfly/quickstarts';
import { History } from 'history';
import { Access } from '@redhat-cloud-services/rbac-client';

declare type ChromeUser = {
  entitlements: {
    [key: string]: {
      is_entitled: boolean;
      is_trial: boolean;
    };
  };
  identity: {
    account_number: string;
    internal?: {
      org_id: string;
      account_id: string;
    };
    type: string;
    user?: {
      username: string;
      email: string;
      first_name: string;
      last_name: string;
      is_active: boolean;
      is_internal: boolean;
      is_org_admin: boolean;
      locale: string;
    };
  };
};

declare type VisibilityFunctions = {
  isOrgAdmin: () => Promise<boolean>;
  isActive: () => Promise<boolean>;
  isInternal: () => Promise<boolean>;
  isEntitled: () => Promise<boolean>;
  isProd: () => boolean;
  isBeta: () => boolean;
  isHidden: () => true;
  withemai: (toHave: string) => Promise<boolean>;
  loosePermissions: (permissions: string[]) => boolean;
  hasPermissions: (permissions: string[]) => boolean;
  hasLocalStorage: (key: string, value: any) => boolean;
  hasCookie: (key: string, value: any) => boolean;
  /** TODO: Extends FEC axios instance config */
  apiRequest: (config: {
    [key: string]: any;
    url: string;
    method?: 'string';
    accessor?: string;
    matcher?: 'isEmpty' | 'isNotEmpty';
  }) => Promise<boolean>;
};

/**
 * TODO: Once chrome is migrated to TS, sychronize with chrome typings
 */
export interface ChromeAPI {
  /** @deprecated will be removed from useChrome hook */
  $internal: any;
  initialized: boolean;
  experimentalApi: boolean;
  /** Return true if current environment is fedramp */
  isFedramp: () => boolean;
  usePendoFeedback: () => void;
  toggleFeedbackModal: (isOpen: boolean) => void;
  quickstarts: {
    version: number;
    set: (key: string, qs: any[]) => void;
    toogle: (quickstartId: string) => void;
    Catalog: typeof QuickStartCatalogPage;
  };
  chromeHistory: History;
  isProd: boolean;
  appAction: (action: string) => void;
  appNavClick: (payload: any) => void;
  appObjectId: (objectId: string) => void;
  auth: {
    doOffline: () => void;
    getOfflineToken: () => Promise<any>;
    getToken: () => Promise<string>;
    getUser: () => Promise<ChromeUser>;
    login: () => Promise<any>;
    logout: () => void;
    /** @deprecated will be removed from useChrome hook */
    qe: any;
  };
  createCase: (fields: Record<string, unknown>) => void;
  enable: {
    iqe: () => void;
    remediationsDebug: () => void;
    invTags: () => void;
    shortSession: () => void;
    jwtDebug: () => void;
    reduxDebug: () => void;
    forcePendo: () => void;
    allDetails: () => void;
    inventoryDrawer: () => void;
    globalFilter: () => void;
    appFilter: () => void;
    contextSwitcher: () => void;
    quickstartsDebug: () => void;
  };
  forceDemo: () => void;
  getApp: () => string;
  getBundle: () => string;
  getEnvironment: () => string;
  getEnvironmentDetails: () => {
    url: string[];
    sso: string;
    portal: string;
  };
  getUserPermissions: (applicationName?: string, disableCache?: boolean) => Promise<Access[]>;
  globalFilterScope: (scope?: string) => void;
  hideGlobalFilter: (hide?: boolean) => void;
  /** @deprecated This function server no purpse. For document title update use "updateDocumentTitle" function instead. */
  identifyApp: (data: any, appTitle?: string) => Promise<undefined>;
  init: () => void;
  isbeta: () => boolean;
  isChrome2: boolean;
  isDemo: () => boolean;
  isPenTest: () => boolean;
  /** TODO: create function typings */
  mapGlobalFilter: (...args: any[]) => any;
  /** @deprecated this function has no effect. */
  navigation: () => void;
  /** TODO: Deprecate this function */
  on: (...args: any[]) => any;
  registerModule: (module: string, manifest: string) => void;
  /** @duplicate of "hideGlobalFilter" TODO: deprecate this function */
  removeGlobalFilter: (isHidden?: boolean) => void;
  updateDocumentTitle: (title: string) => void;
  visibilityFunctions: VisibilityFunctions;
}

export type UseChromeSelector<T = any> = (chromeState: ChromeAPI) => T;

const useChrome = (selector?: UseChromeSelector) => {
  const state = useScalprum<{ initialized: boolean; api: { chrome: ChromeAPI } }>();
  let chrome: ChromeAPI = state.api?.chrome || {};
  chrome = {
    ...chrome,
    initialized: state.initialized,
  };
  if (typeof selector === 'function') {
    return selector(chrome);
  }

  return chrome;
};

export default useChrome;
