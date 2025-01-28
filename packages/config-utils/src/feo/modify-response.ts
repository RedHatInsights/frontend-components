import fecLogger, { LogType } from '../fec-logger';
import { matchNavigationRequest, matchSearchIndexRequest, matchServiceTilesRequest } from './check-outgoing-requests';
import { ChromeStaticSearchEntry, FrontendCRD, GeneratedBundles, ServicesTilesResponseEntry } from './feo-types';
import navigationInterceptor from './navigation-interceptor';
import searchInterceptor from './search-interceptor';
import serviceTilesInterceptor from './service-tiles-interceptor';

function isGeneratedBundles(
  body: GeneratedBundles | ChromeStaticSearchEntry[] | ServicesTilesResponseEntry[],
  url: string
): body is GeneratedBundles {
  return matchNavigationRequest(url);
}

function isSearchIndex(
  body: GeneratedBundles | ChromeStaticSearchEntry[] | ServicesTilesResponseEntry[],
  url: string
): body is ChromeStaticSearchEntry[] {
  return matchSearchIndexRequest(url);
}

function isServiceTiles(
  body: GeneratedBundles | ChromeStaticSearchEntry[] | ServicesTilesResponseEntry[],
  url: string
): body is ServicesTilesResponseEntry[] {
  return matchServiceTilesRequest(url);
}

export function modifyRequest(body: string, url: string, frontendCrd: FrontendCRD): string {
  // intentionally let the parse throw an error to parent to handle unfinished request chunks
  const objectToModify = JSON.parse(body);
  // return original if no match is found
  let payload: string = body;
  try {
    if (isGeneratedBundles(objectToModify, url)) {
      const resultBundles: GeneratedBundles = [];
      objectToModify.forEach((bundle) => {
        const navItems = navigationInterceptor(frontendCrd, bundle, bundle.id);
        resultBundles.push({ ...bundle, navItems });
      });
      payload = JSON.stringify(resultBundles);
    } else if (isSearchIndex(objectToModify, url)) {
      const staticSearch = objectToModify as ChromeStaticSearchEntry[];
      const result = searchInterceptor(staticSearch, frontendCrd);
      payload = JSON.stringify(result);
    } else if (isServiceTiles(objectToModify, url)) {
      const staticServicesTiles = objectToModify as ServicesTilesResponseEntry[];
      const result = serviceTilesInterceptor(staticServicesTiles, frontendCrd);
      payload = JSON.stringify(result);
    }
    return payload;
  } catch (error) {
    fecLogger(LogType.error, `Error modifying proxy request via config interceptors: ${error}`);
    return payload;
  }
}
