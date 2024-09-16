import { FederatedModulesConfig } from '@redhat-cloud-services/frontend-components-config-utilities';
import { CreateConfigOptions } from './createConfig';
import { CreatePluginsOptions, RspackPluginDefinition } from './createPlugins';

export interface FECConfiguration
  extends Partial<Omit<CreateConfigOptions, 'appUrl' | 'appName' | 'env' | 'rootFolder'>>,
    Partial<Omit<CreatePluginsOptions, 'rootFolder' | 'appName'>> {
  appName: never;
  appUrl: string | string[] | (string | RegExp)[];
  plugins?: RspackPluginDefinition[];
  interceptChromeConfig?: boolean;
  moduleFederation: Omit<FederatedModulesConfig, 'root' | 'separateRuntime'>;
  debug?: boolean;
  chromeHost?: string;
  chromePort?: number;
}

export default FECConfiguration;
