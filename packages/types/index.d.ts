import { QuickStart, QuickStartCatalogPage } from '@patternfly/quickstarts';
import { History } from 'history';
import { Access } from '@redhat-cloud-services/rbac-client';
import { AnalyticsBrowser } from '@segment/analytics-next';
import { Method } from 'axios';

export declare type HelpTopicLink = {
  href: string;
  text?: string;
  newTab?: boolean;
  isExternal?: boolean;
};

export declare type HelpTopic = {
  name: string;
  title: string;
  tags: string[];
  content: string;
  links?: HelpTopicLink[];
};

declare type ChromeUser = {
  entitlements: {
    [key: string]: {
      is_entitled: boolean;
      is_trial: boolean;
    };
  };
  identity: {
    account_number: string;
    org_id: string;
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
  isEntitled: (appName?: string) => Promise<{ [key: string]: boolean }>;
  isProd: () => boolean;
  isBeta: () => boolean;
  isHidden: () => true;
  withEmail: (toHave: string) => Promise<boolean>;
  loosePermissions: (permissions: string[]) => Promise<boolean>;
  hasPermissions: (permissions: string[]) => Promise<boolean>;
  hasLocalStorage: (key: string, value: any) => boolean;
  hasCookie: (key: string, value: any) => boolean;
  /** TODO: Extends FEC axios instance config */
  apiRequest: (config: {
    [key: string]: any;
    url: string;
    method?: Method;
    accessor?: string;
    matcher?: 'isEmpty' | 'isNotEmpty';
  }) => Promise<boolean>;
  featureFlag: (flagName: string, expectedValue: boolean) => boolean;
};

/**
 * TODO: Once chrome is migrated to TS, sychronize with chrome typings
 */
export type NavDOMEvent = {
  href: string;
  id: string;
  navId: string;
  type: string;
  target?: HTMLAnchorElement | null;
};

export type AppNavigationCB = (navEvent: { navId?: string; domEvent: NavDOMEvent }) => void;
export type GenericCB = (...args: unknown[]) => void;

export type OnEventCallbacks = {
  APP_NAVIGATION: AppNavigationCB;
  NAVIGATION_TOGGLE: GenericCB;
  GLOBAL_FILTER_UPDATE: GenericCB;
};

declare function OnChromeEvent<K extends 'APP_NAVIGATION' | 'NAVIGATION_TOGGLE' | 'GLOBAL_FILTER_UPDATE'>(
  event: K,
  callback: OnEventCallbacks[K]
): undefined | (() => void) | (() => undefined) | (() => boolean);

export type EnableTopicsArgs = [{ names: string[]; append?: boolean }] | string[];

export interface ChromeAPI {
  /** @deprecated will be removed from useChrome hook */
  $internal: any;
  initialized: boolean;
  experimentalApi: boolean;
  /** Return true if current environment is fedramp */
  isFedramp: boolean;
  usePendoFeedback: () => void;
  toggleFeedbackModal: (isOpen: boolean) => void;
  quickStarts: {
    version: number;
    set: (key: string, quickstarts: QuickStart[]) => void;
    toggle: (quickstartId: string) => void;
    Catalog: typeof QuickStartCatalogPage;
  };
  chromeHistory: History;
  isProd: () => boolean;
  appAction: (action: string) => void;
  appNavClick: (payload: any) => void;
  appObjectId: (objectId: string) => void;
  auth: {
    doOffline: () => void;
    getOfflineToken: () => Promise<any>;
    getToken: () => Promise<string | undefined>;
    getUser: () => Promise<ChromeUser | void>;
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
  getEnvironmentDetails: () =>
    | undefined
    | {
        url: string[];
        sso: string;
        portal: string;
      };
  getUserPermissions: (applicationName?: string, disableCache?: boolean) => Promise<Access[]>;
  globalFilterScope: (scope: string) => {
    type: string;
    payload: string;
  };
  helpTopics: {
    addHelpTopics: (topics: HelpTopic[], enabled?: boolean) => void;
    enableTopics: (...topicsNames: EnableTopicsArgs) => Promise<HelpTopic[]>;
    disableTopics: (...topicsNames: string[]) => void;
    setActiveTopic: (name: string) => Promise<void>;
    closeHelpTopic: () => void;
  };
  hideGlobalFilter: (isHidden: boolean) => void;
  /** @deprecated This function server no purpse. For document title update use "updateDocumentTitle" function instead. */
  identifyApp: (data: any, appTitle?: string, noSuffix?: boolean) => Promise<any>;
  /**  @deprecated this function has no effect */
  init: () => void;
  isBeta: () => boolean;
  isChrome2: boolean;
  isDemo: () => boolean;
  isPenTest: () => boolean;
  /** TODO: create function typings */
  mapGlobalFilter: (...args: any[]) => any;
  /** @deprecated this function has no effect. */
  navigation: () => void;
  /**
   * Example usage
   * on<'APP_NAVIGATION'>('APP_NAVIGATION', (navEvent) => {
   * navEvent.domEvent.href;
   * navEvent.navId;
   * });
   */
  on: typeof OnChromeEvent;
  registerModule: (module: string, manifest: string) => void;
  /** @duplicate of "hideGlobalFilter" TODO: deprecate this function */
  removeGlobalFilter: (isHidden: boolean) => {
    type: string;
    payload: {
      isHidden: boolean;
    };
  };
  updateDocumentTitle: (title: string, noSuffix?: boolean) => void;
  visibilityFunctions: VisibilityFunctions;
  isAnsibleTrialFlagActive: () => boolean | undefined;
  setAnsibleTrialFlag: () => void;
  clearAnsibleTrialFlag: () => void;
  // segment API
  segment: {
    setPageMetadata: (pageOptions?: Record<string, unknown>) => void;
  };
  analytics: AnalyticsBrowser;
  useGlobalFilter: <T = undefined>(
    callback: (selectedTags?: {
      [key: string]: {
        [key: string]: {
          isSelected?: boolean;
          value: string;
          item?: {
            tagKey?: string;
            tagValue?: string;
          };
          group?: {
            items?: unknown;
          };
        };
      };
    }) => T
  ) => T;
}

declare global {
  interface Window {
    insights: {
      chrome: ChromeAPI;
    };
  }
}
