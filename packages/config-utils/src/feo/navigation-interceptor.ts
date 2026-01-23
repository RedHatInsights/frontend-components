import { BundleSegment, DirectNavItem, FrontendCRD, Nav, SegmentRef } from './feo-types';

function hasSegmentRef(item: DirectNavItem): item is Omit<DirectNavItem, 'segmentRef'> & { segmentRef: SegmentRef } {
  return typeof item?.segmentRef?.segmentId === 'string' && typeof item?.segmentRef?.frontendName === 'string';
}

const bundleSegmentsCache: { [bundleSegmentId: string]: BundleSegment } = {};
const navSegmentCache: { [navSegmentId: string]: DirectNavItem } = {};

const getBundleSegments = (segmentCache: typeof bundleSegmentsCache, bundleId: string) => {
  return Object.values(segmentCache)
    .filter((segment) => segment.bundleId === bundleId)
    .reduce<typeof bundleSegmentsCache>((acc, curr) => {
      acc[curr.segmentId] = curr;
      return acc;
    }, {});
};

function findMatchingSegmentItem(navItems: DirectNavItem[], matchId: string): DirectNavItem | undefined {
  let match = navItems.find((item) => {
    if (!hasSegmentRef(item)) {
      return item.id === matchId;
    }
    return false;
  });

  if (!match) {
    for (let i = 0; navItems[i] && !match; i += 1) {
      const curr = navItems[i];
      if (!hasSegmentRef(curr) && curr.routes) {
        match = findMatchingSegmentItem(curr.routes, matchId);
      } else if (!hasSegmentRef(curr) && curr.navItems) {
        match = findMatchingSegmentItem(curr.navItems, matchId);
      }
    }
  }

  return match;
}

function handleNestedNav(
  segmentMatch: DirectNavItem,
  originalNavItem: DirectNavItem,
  bSegmentCache: typeof bundleSegmentsCache,
  nSegmentCache: typeof navSegmentCache,
  bundleId: string,
  currentFrontendName: string,
  parentSegment: BundleSegment
): DirectNavItem {
  const { routes, navItems, ...segmentItem } = segmentMatch;
  let parsedRoutes: DirectNavItem[] | undefined = originalNavItem.routes;
  let parsedNavItems: DirectNavItem[] | undefined = originalNavItem.navItems;

  // Merge local segment routes with remote routes
  if (routes && routes.length > 0) {
    // Start with remote routes (originalNavItem.routes) as base
    const remoteRoutes = originalNavItem.routes || [];

    // Create a map of remote routes by ID for efficient lookup
    const remoteRoutesMap = new Map(remoteRoutes.map(route => [route.id, route]));

    // Start with local routes and merge with remote properties
    const mergedRoutes = routes.map(localRoute => {
      if (localRoute.id && remoteRoutesMap.has(localRoute.id)) {
        const remoteRoute = remoteRoutesMap.get(localRoute.id)!;
        // Merge: remote properties as base, local properties override
        return { ...remoteRoute, ...localRoute };
      }
      return localRoute;
    });

    // Add remote routes that don't exist in local routes
    remoteRoutes.forEach(remoteRoute => {
      if (remoteRoute.id && !routes.some(localRoute => localRoute.id === remoteRoute.id)) {
        mergedRoutes.push(remoteRoute);
      }
    });

    // Process the merged routes recursively
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    parsedRoutes = parseNavItems(mergedRoutes, bSegmentCache, nSegmentCache, bundleId, currentFrontendName);
  } else if (parsedRoutes) {
    // No local routes, just process remote routes
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    parsedRoutes = parseNavItems(parsedRoutes, bSegmentCache, nSegmentCache, bundleId, currentFrontendName);
  }

  // Merge local segment navItems with remote navItems (similar logic)
  if (navItems && navItems.length > 0) {
    // Start with remote navItems (originalNavItem.navItems) as base
    const remoteNavItems = originalNavItem.navItems || [];

    // Create a map of remote navItems by ID for efficient lookup
    const remoteNavItemsMap = new Map(remoteNavItems.map(navItem => [navItem.id, navItem]));

    // Start with local navItems and merge with remote properties
    const mergedNavItems = navItems.map(localNavItem => {
      if (localNavItem.id && remoteNavItemsMap.has(localNavItem.id)) {
        const remoteNavItem = remoteNavItemsMap.get(localNavItem.id)!;
        // Merge: remote properties as base, local properties override
        return { ...remoteNavItem, ...localNavItem };
      }
      return localNavItem;
    });

    // Add remote navItems that don't exist in local navItems
    remoteNavItems.forEach(remoteNavItem => {
      if (remoteNavItem.id && !navItems.some(localNavItem => localNavItem.id === remoteNavItem.id)) {
        mergedNavItems.push(remoteNavItem);
      }
    });

    // Process the merged navItems recursively
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    parsedNavItems = parseNavItems(mergedNavItems, bSegmentCache, nSegmentCache, bundleId, currentFrontendName);
  } else if (parsedNavItems) {
    // No local navItems, just process remote navItems
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    parsedNavItems = parseNavItems(parsedNavItems, bSegmentCache, nSegmentCache, bundleId, currentFrontendName);
  }

  return {
    ...originalNavItem,
    ...segmentItem,
    position: parentSegment.position,
    routes: parsedRoutes,
    navItems: parsedNavItems,
  };
}

function findNavItemsFirstSegmentIndex(navItems: DirectNavItem[], frontendName: string) {
  return navItems.findIndex((item) => {
    return hasSegmentRef(item) && item.segmentRef.frontendName === frontendName;
  });
}

function findSegmentSequenceLength(navItems: DirectNavItem[], sequenceStartIndex: number, sementId: string, frontendName: string) {
  let finalIndex = sequenceStartIndex;
  for (let i = sequenceStartIndex; i < navItems.length; i += 1) {
    const item = navItems[i];
    const prev = navItems[i - 1];
    if (!prev) {
      finalIndex = i;
      continue;
    }

    if (item.segmentRef?.segmentId === sementId && item.segmentRef.frontendName === frontendName) {
      finalIndex = i;
    } else {
      i = navItems.length;
    }
  }
  return finalIndex - sequenceStartIndex + 1;
}

function parseNavItems(
  navItems: DirectNavItem[],
  bSegmentCache: typeof bundleSegmentsCache,
  nSegmentCache: typeof navSegmentCache,
  bundleId: string,
  currentFrontendName: string
): DirectNavItem[] {
  const relevantSegments = getBundleSegments(bSegmentCache, bundleId);
  const res = navItems.map((navItem) => {
    if (!hasSegmentRef(navItem) && navItem.id) {
      // replaces the attributes on matched items
      const { id, bundleSegmentRef } = navItem;
      if (navItem.frontendRef === currentFrontendName && bundleSegmentRef && relevantSegments[bundleSegmentRef]) {
        const parentSegment = relevantSegments[bundleSegmentRef];
        const segmentItemMatch = findMatchingSegmentItem(relevantSegments[bundleSegmentRef].navItems, id);
        if (segmentItemMatch && !hasSegmentRef(segmentItemMatch)) {
          return handleNestedNav(segmentItemMatch, navItem, bSegmentCache, nSegmentCache, bundleId, currentFrontendName, parentSegment);
        }
      } else if (typeof navItem.groupId === 'string' && navItem.groupId.length > 0) {
        navItem.navItems = parseNavItems(navItem.navItems || [], bSegmentCache, nSegmentCache, bundleId, currentFrontendName);
        return navItem;
      }
    }
    return navItem;
  });
  // replace segment sequence with the segment data
  let segmentIndex = findNavItemsFirstSegmentIndex(res, currentFrontendName);
  let iterations = 0;
  while (segmentIndex > -1 && iterations < 100) {
    const segment = res[segmentIndex];
    if (hasSegmentRef(segment)) {
      const replacement = nSegmentCache[segment.segmentRef.segmentId];
      if (replacement && replacement.navItems) {
        // find how many items are in the original segment sequence
        const replaceLength = findSegmentSequenceLength(res, segmentIndex, segment.segmentRef.segmentId, currentFrontendName);
        const nestedNavItems = replacement.navItems.map((navItem) => {
          if (navItem.routes) {
            return {
              ...navItem,
              routes: parseNavItems(navItem.routes, bSegmentCache, nSegmentCache, bundleId, currentFrontendName),
            };
          } else if (navItem.navItems) {
            return {
              ...navItem,
              navItems: parseNavItems(navItem.navItems, bSegmentCache, nSegmentCache, bundleId, currentFrontendName),
            };
          }
          return navItem;
        });
        res.splice(segmentIndex, replaceLength, ...nestedNavItems);
      }
    }
    // make sure to try to find another
    segmentIndex = findNavItemsFirstSegmentIndex(res, currentFrontendName);
    iterations += 1;
  }

  return res;
}

// replaces changed nav items, local data overrides the remote data
const substituteLocalNav = (frontendCRD: FrontendCRD, nav: Nav, bundleName: string) => {
  let res: DirectNavItem[] = [];
  const bundleSegmentsCache: { [bundleSegmentId: string]: BundleSegment } = {};
  const navSegmentCache: { [navSegmentId: string]: DirectNavItem } = {};
  frontendCRD.objects.forEach((obj) => {
    const bundleSegments = obj.spec.bundleSegments || [];
    bundleSegments.forEach((bundleSegment) => {
      bundleSegmentsCache[bundleSegment.segmentId] = bundleSegment;
    });
    const navSegments = obj.spec.navigationSegments || [];
    navSegments.forEach((navSegment) => {
      if (navSegment.segmentId) {
        navSegmentCache[navSegment.segmentId] = navSegment;
      }
    });

    const missingSegments: BundleSegment[] = [...(obj.spec.bundleSegments || [])].filter((segment) => {
      if (segment.bundleId !== bundleName) {
        return false;
      }
      return !nav.navItems.find((navItem) => {
        return navItem.bundleSegmentRef === segment.segmentId;
      });
    });
    const missingNavItems: DirectNavItem[] = missingSegments
      .map((segment) => segment.navItems.map((navItem) => ({ ...navItem, position: segment.position })))
      .flat();
    const parseInput = [...nav.navItems, ...missingNavItems];
    // handle top level missing bundle segments and sorting of them
    res = parseNavItems(parseInput, bundleSegmentsCache, navSegmentCache, bundleName, obj.metadata.name);
  });

  // order top level segments based on position
  res.sort((a, b) => {
    if (typeof a.position !== 'number' || typeof b.position !== 'number') {
      return 0;
    }

    return a.position - b.position;
  });
  return res;
};

export default substituteLocalNav;
