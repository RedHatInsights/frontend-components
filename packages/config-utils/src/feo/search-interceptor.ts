import { ChromeStaticSearchEntry, FrontendCRD } from './feo-types';

function searchInterceptor(staticSearchIndex: ChromeStaticSearchEntry[], frontendCRD: FrontendCRD): ChromeStaticSearchEntry[] {
  const frontendRef = frontendCRD.objects[0].metadata.name;
  const result = staticSearchIndex.filter((entry) => entry.frontendRef !== frontendRef);
  return [...result, ...(frontendCRD.objects[0].spec.searchEntries ?? [])];
}

export default searchInterceptor;
