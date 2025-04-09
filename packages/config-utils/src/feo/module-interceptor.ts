import { ChromeModuleRegistry, FrontendCRD } from './feo-types';

function moduleInterceptor(moduleRegistry: ChromeModuleRegistry, frontendCRD: FrontendCRD): ChromeModuleRegistry {
  const moduleName = frontendCRD.objects[0].metadata.name;
  const cdnPath = frontendCRD.objects[0].spec.frontend.paths[0];
  return {
    ...moduleRegistry,
    [moduleName]: {
      ...frontendCRD.objects[0].spec.module,
      cdnPath,
    },
  };
}

export default moduleInterceptor;
