import { resolve } from 'path';
import fedModule from './federated-modules';
import ExtensionsMapper from './extension-mapper';
import { Compiler, WebpackPluginInstance } from 'webpack';

type FedMod = {
  moduleName: string;
  libName: string;
  useFileHash: boolean;
  libType: string;
  root?: string;
};

type ExtensionsPluginOptions = {
  remoteEntryCallback: string;
  remoteEntryFile: string;
  pluginManifestFile: string;
};

/**
 * @deprecated
 * Do not use the Extensions plugin. The default config already supports extensions.
 */
class ExtensionsPlugin implements WebpackPluginInstance {
  fedMod: FedMod;
  options: ExtensionsPluginOptions;
  plugin: any;
  constructor(plugin: any, fedMod: Partial<FedMod>, options: Partial<ExtensionsPluginOptions>) {
    if (!plugin) {
      throw new Error('Missing plugin config!');
    }

    this.plugin = plugin;
    this.fedMod = {
      moduleName: 'plugin-entry',
      libName: 'window.loadPluginEntry',
      useFileHash: false,
      libType: 'jsonp',
      ...fedMod,
    };
    this.options = {
      remoteEntryCallback: 'window.loadPluginEntry',
      remoteEntryFile: `${this.fedMod.moduleName}.js`,
      pluginManifestFile: 'plugin-manifest.json',
      ...options,
    };
  }

  apply(compiler: Compiler) {
    const root = this.fedMod.root || compiler.context;
    const { insights, version, description } = require(resolve(root, './package.json')) || {};

    // create federation module
    fedModule({
      ...this.fedMod,
      root,
    }).apply(compiler);

    // generate plugin manifest and update plugin-entry file
    new ExtensionsMapper(
      {
        ...this.plugin,
        name: this.plugin.name || (insights && insights.appname),
        version: this.plugin.version || version || '0.0.0',
        displayName: this.plugin.displayName || '',
        description: this.plugin.description || description || '',
        dependencies: { ...(this.plugin.dependencies || {}) },
        disableStaticPlugins: [...(this.plugin.disableStaticPlugins || [])],
        extensions: [...(this.plugin.extensions || [])],
      },
      this.options
    ).apply(compiler);
  }
}

module.exports = ExtensionsPlugin;
