import { FederatedModulesConfig } from '@redhat-cloud-services/frontend-components-config-utilities';
import { CreateConfigOptions } from './createConfig';
import { CreatePluginsOptions, WebpackPluginDefinition } from './createPlugins';

export interface FECConfiguration
  extends Partial<Omit<CreateConfigOptions, 'appUrl' | 'appName' | 'env' | 'rootFolder'>>,
    Partial<Omit<CreatePluginsOptions, 'rootFolder' | 'appName'>> {
  appName: never;
  appUrl: string | string[] | (string | RegExp)[];
  plugins?: WebpackPluginDefinition[];
  /** @deprecated dynamic FEO config is automatically intercepted locally as of @redhat-cloud-services/frontend-components-config >= 6.5.4 and @redhat-cloud-services/frontend-components-config-utilities >= 4.3.1 */
  interceptChromeConfig?: boolean;
  moduleFederation: Omit<FederatedModulesConfig, 'root' | 'separateRuntime'>;
  debug?: boolean;
  chromeHost?: string;
  chromePort?: number;
  frontendCRDPath?: string;
}

export default FECConfiguration;
