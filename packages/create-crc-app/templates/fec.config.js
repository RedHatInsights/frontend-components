module.exports = {
	appUrl: @@appUrl,
	debug: true,
	useProxy: true,
	proxyVerbose: true,
	/**
	 * Change to false after your app is registered in configuration files
	 */
	interceptChromeConfig: {{interceptChromeConfig}},
	/**
	 * Add additional webpack plugins
	 */
	plugins: [],
};
  