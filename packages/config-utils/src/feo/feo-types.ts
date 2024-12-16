export type SupportCaseData = {
  version: string;
  product: string;
};

export type ChromeGlobalModuleConfig = {
  supportCaseData?: SupportCaseData;
  ssoScopes?: string[];
};

export type ChromePermissions = {
  method: string;
  apps?: string[];
  args?: unknown[];
};

export type ChromeEntryModuleRoute = {
  pathname: string;
  exact?: boolean;
  props?: object;
  supportCaseData?: SupportCaseData;
  permissions?: ChromePermissions;
};

export type ChromeEntryModule = {
  id: string;
  module: string;
  routes: ChromeEntryModuleRoute[];
};

type ChromeModuleAnalytics = {
  APIKey: string;
};

export type ChromeModule = {
  manifestLocation: string;
  defaultDocumentTitle?: string;
  /**
   * @deprecated
   * use `moduleConfig` instead
   */
  config?: object;
  moduleConfig?: ChromeGlobalModuleConfig;
  modules?: ChromeEntryModule[];
  /**
   * @deprecated
   * Use feo generated resources to get permitted modules
   */
  isFedramp?: boolean;
  analytics?: ChromeModuleAnalytics;
};

export type ChromeModuleRegistry = {
  [moduleName: string]: ChromeModule;
};

export type ChromeStaticSearchEntry = {
  frontendRef: string;
  id: string;
  href: string;
  title: string;
  description: string;
  alt_title?: string[];
  isExternal?: boolean;
};

export type SegmentRef = {
  segmentId: string;
  frontendName: string;
};

export type DirectNavItem = {
  id?: string;
  frontendRef?: string;
  href?: string;
  title?: string;
  expandable?: boolean;
  // should be removed
  appId?: string;
  routes?: DirectNavItem[];
  navItems?: DirectNavItem[];
  bundleSegmentRef?: string;
  segmentRef?: SegmentRef;
  segmentId?: string;
};

export type Nav = {
  title?: string;
  id: string;
  navItems: DirectNavItem[];
};

export type BundleSegment = {
  segmentId: string;
  bundleId: string;
  position: number;
  navItems: DirectNavItem[];
};

export type CRDObject = {
  metadata: {
    name: string;
  };
  spec: {
    bundleSegments?: BundleSegment[];
    navigationSegments?: DirectNavItem[];
    module: ChromeModule;
    searchEntries?: ChromeStaticSearchEntry[];
  };
};

export type FrontendCRD = {
  objects: CRDObject[];
};
