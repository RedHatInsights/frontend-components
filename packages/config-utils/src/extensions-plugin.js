const { resolve } = require('path');
const fedModule = require('./federated-modules');
const ExtensionsMapper = require('./extension-mapper');

class ExtensionsPlugin {
  constructor(plugin, fedMod, options) {
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

  apply(compiler) {
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
