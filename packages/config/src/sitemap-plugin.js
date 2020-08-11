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

            const paths = Object.values(packageJson?.routes || {}).map(value => value.path || value);
            const hostname = 'https://cloud.redhat.com';

            const sitemap = Sitemap.sitemapBuilder(hostname, paths);
            fs.writeFileSync(`${resolve(this.rootFolder, 'sitemap.xml')}`, sitemap.toString());

            callback();
        });
    }
}

module.exports = SitemapPlugin;
