export function matchNavigationRequest(url: string): boolean {
  return !!url.match(/\/api\/chrome-service\/v1\/static\/bundles-generated\.json/);
}

export function matchSearchIndexRequest(url: string): boolean {
  return !!url.match(/\/api\/chrome-service\/v1\/static\/search-index-generated\.json/);
}

export function matchServiceTilesRequest(url: string): boolean {
  return !!url.match(/\/api\/chrome-service\/v1\/static\/service-tiles-generated\.json/);
}

export function matchModulesRequest(url: string): boolean {
  return !!url.match(/\/api\/chrome-service\/v1\/static\/fed-modules-generated\.json/);
}

export function isInterceptAbleRequest(url: string): boolean {
  const checks = [matchNavigationRequest, matchSearchIndexRequest, matchServiceTilesRequest, matchModulesRequest];
  return checks.some((check) => check(url));
}
