/* eslint-disable camelcase */

import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import nodeGlobals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import { createFilter } from 'rollup-pluginutils';
import { dependencies } from './package.json';

const external = createFilter(
    Object.keys(dependencies).map(item => item.includes('@patternfly') ? `${item}/**` : item),
    null,
    { resolve: false }
);

const globals = {
    react: 'React',
    'react-dom': 'ReactDOM',
    '@patternfly/react-core': '@patternfly/react-core',
    '@patternfly/react-icons': '@patternfly/react-icons'
};

const commonjsOptions = {
    ignoreGlobal: true,
    include: /node_modules/
};

const babelOptions = {
    exclude: /node_modules/,
    runtimeHelpers: true,
    configFile: './babel.config.js'
};

const plugins = [
    nodeResolve(),
    babel(babelOptions),
    commonjs(commonjsOptions),
    nodeGlobals(),
    terser({
        keep_classnames: true,
        keep_fnames: true
    }),
    postcss({
        inject: true
    }),
    sizeSnapshot({ snapshotPath: './size-snapshot.json' }),
    json()
];

export default [{
    input: './src/index.js',
    output: {
        file: './dist/umd/index.js',
        format: 'umd',
        name: '@redhat-cloud-services/frontend-components-pdf-generator',
        globals
    },
    external,
    plugins
}, {
    input: './src/index.js',
    output: {
        file: './dist/cjs/index.js',
        format: 'cjs',
        name: '@redhat-cloud-services/frontend-components-pdf-generator',
        globals
    },
    external,
    plugins
}, {
    input: './src/index.js',
    output: {
        file: './dist/esm/index.js',
        format: 'esm',
        name: '@redhat-cloud-services/frontend-components-pdf-generator',
        globals
    },
    external,
    plugins
}];
