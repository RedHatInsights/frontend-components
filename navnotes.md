# Nav notes updates

## Current attributes

### appId

For some reason nav items in expandable item require `appId` to show. This should not be required a it needs to b fixed in chrome: https://github.com/RedHatInsights/insights-chrome/blob/master/src/components/Navigation/ChromeNavExpandable.tsx#L7

### id

Id should be mandatory attribute of any non segment nav item


## Missing FEO nav attributes

### bundleSegmentRef

Required to match nav item to bundle segment from frontend crd.

Nav items should inherit this from the bundle segment they come from.

Should be needed only by the first level.

### segmentRef

Same as `bundleSegmentRef`, but for global segments.

### frontendRef

Required to match nav item in bundle to current app

# Search interceptor notes

## frontendRef

search entries need a `frontendRef` attribute. Without the attribute, we can modify/add frontend entries, but we can't remove them

# Service tiles interceptor

## frontendRef

Service tile entries need a `frontendRef` attribute. Without the attribute, we can modify/add frontend entries, but we can't remove them
