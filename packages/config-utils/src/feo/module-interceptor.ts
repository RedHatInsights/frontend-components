import { ChromeModuleRegistry, FrontendCRD } from './feo-types';

function moduleInterceptor(moduleRegistry: ChromeModuleRegistry, frontendCRD: FrontendCRD): ChromeModuleRegistry {
  const moduleName = frontendCRD.objects[0].metadata.name;
  return {
    ...moduleRegistry,
    [moduleName]: frontendCRD.objects[0].spec.module,
  };
}

export default moduleInterceptor;
