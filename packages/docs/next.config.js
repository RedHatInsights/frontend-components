const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/
});
const withCSS = require('@zeit/next-css');
const resolve = require('resolve');
const path = require('path');

module.exports = withMDX(withCSS({
    pageExtensions: [ 'js', 'jsx', 'md', 'mdx' ],
    webpack: (config, options) => {    const { dir, isServer } = options;
        config.externals = [];

        if (isServer) {
            config.externals.push((context, request, callback) => {
                resolve(
                    request,
                    { basedir: dir, preserveSymlinks: true },
                    (err, res) => {
                        if (err) {
                            return callback();
                        }

                        // Next.js by default adds every module from node_modules to
                        // externals on the server build. This brings some undesirable
                        // behaviors because we can't use modules that require CSS files like
                        // `former-kit-skin-pagarme`.
                        //
                        // The lines below blacklist webpack itself (that cannot be put on)
                        if (
                            res.match(/node_modules[/\\].*\.js/) &&
                            !res.match(/node_modules[/\\]webpack/) &&
                            !res.match(/node_modules[/\\]@patternfly\/react-core/) &&
                            !res.match(/node_modules[/\\]@patternfly\/react-styles/) &&
                            !res.match(/node_modules[/\\]@patternfly\/react-icons/) &&
                            !res.match(/node_modules[/\\]@patternfly\/react-tokens/) &&
                            !res.match(/node_modules[/\\]@redhat-cloud-services\/frontend-components/)
                        ) {
                            return callback(null, `commonjs ${request}`);
                        }

                        callback();
                    }
                );
            });
        }

        config.resolve.alias = {
            ...config.resolve.alias,
            '@docs/example-component': path.resolve(__dirname, './components/example-component'),
            '@docs/examples': path.resolve(__dirname, './examples')
        };

        config.module.rules.push({
            test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 100000
                }
            }
        });

        return config;
    }
}));
