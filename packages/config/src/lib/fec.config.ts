import { FederatedModulesConfig } from '@redhat-cloud-services/frontend-components-config-utilities';
import { CreateConfigOptions } from './createConfig';
import { CreatePluginsOptions, WebpackPluginDefinition } from './createPlugins';

export type FECConfiguration = Partial<Omit<CreateConfigOptions, 'appName' | 'env' | 'rootFolder'>> &
  Partial<Omit<CreatePluginsOptions, 'rootFolder' | 'appName'>> & {
    appUrl: string | string[] | (string | RegExp)[];
    plugins?: WebpackPluginDefinition[];
    interceptChromeConfig?: boolean;
    moduleFederation: Omit<FederatedModulesConfig, 'root' | 'separateRuntime'>;
    debug?: boolean;
  };

export default FECConfiguration;
