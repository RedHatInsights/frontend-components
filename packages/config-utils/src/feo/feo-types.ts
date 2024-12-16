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
  };
};

export type FrontendCRD = {
  objects: CRDObject[];
};
