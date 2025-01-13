export function matchNavigationRequest(url: string): boolean {
  return !!url.match(/\/api\/chrome-service\/v1\/static\/bundles-generated\.json/);
}
