/* eslint-disable camelcase */
import { createFilter } from 'rollup-pluginutils';
import { dependencies } from './package.json';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import nodeGlobals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import rollupPlugins from '../../config/rollup-plugins';

const external = createFilter(
    Object.keys(dependencies).map(item => item.includes('@patternfly') ? `${item}/**` : item)
    .filter(item => item !== 'react' && item !== 'react-dom'),
    null,
    { resolve: false }
);

const globals = {
    '@patternfly/react-core': '@patternfly/react-core',
    '@patternfly/react-icons': '@patternfly/react-icons'
};

const commonjsOptions = {
    ignoreGlobal: true,
    include: /node_modules/,
    namedExports: {
      'react/jsx-runtime': ['jsx', 'jsxs'],
    }
};

const babelOptions = {
    exclude: /node_modules/,
    runtimeHelpers: true,
    configFile: './babel.config.js'
};

const plugins = [
    ...rollupPlugins,
    nodeResolve({
        browser: true
    }),
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
