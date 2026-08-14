import { ChromeWidgetEntry, FrontendCRD } from './feo-types';

function widgetRegistryInterceptor(widgetEntries: ChromeWidgetEntry[], frontendCrd: FrontendCRD): ChromeWidgetEntry[] {
  const frontendName = frontendCrd.objects[0].metadata.name;
  const result = widgetEntries.filter((entry) => entry.frontendRef !== frontendName);

  return [...result, ...(frontendCrd.objects[0].spec.widgetRegistry ?? [])];
}

export default widgetRegistryInterceptor;
