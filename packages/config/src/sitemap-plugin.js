const { resolve } = require('path');
const Sitemap = require('react-router-sitemap');
const fs = require('fs');

class SitemapPlugin {
    constructor(rootFolder) {
        this.rootFolder = rootFolder;
    }

    apply(compiler) {
        compiler.hooks.emit.tapAsync('SitemapPlugin', (compilation, callback) => {
            const packageJson = require(resolve(this.rootFolder, 'package.json'));
            const prefix = packageJson && packageJson.routes && packageJson.routes.prefix;
            const appname = packageJson && packageJson.routes && packageJson.routes.appname;

            const paths = Object.entries(packageJson && packageJson.routes || {}).filter(([ key ]) => key !== 'prefix').map(value => value[1].path || value[1]);
            const hostname = `https://cloud.redhat.com/${prefix}/${appname}`;

            const sitemap = Sitemap.sitemapBuilder(hostname, paths);
            fs.writeFileSync(`${resolve(this.rootFolder, 'sitemap.xml')}`, sitemap.toString());

            callback();
        });
    }
}

module.exports = SitemapPlugin;
