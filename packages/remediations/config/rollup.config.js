/* eslint-disable camelcase */
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import nodeGlobals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import { dependencies, peerDependencies, name } from '../package.json';
import {
    rollupConfig,
    externalDeps,
    external,
    globals
} from '../../../config/rollup-contants';
import rollupPlugins from '../../../config/rollup-plugins';

const commonjsOptions = {
    ignoreGlobal: true,
    include: /node_modules/,
    namedExports: {
        '../../node_modules/@patternfly/react-table/node_modules/lodash/lodash.js': [
            'mergeWith',
            'isFunction',
            'isArray',
            'isEqualWith',
            'isEqual'
        ]
    }
};

const babelOptions = {
    exclude: /node_modules/,
    runtimeHelpers: true,
    configFile: './babel.config'
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
        minimize: true,
        extract: true
    }),
    json()
];

export default rollupConfig(
    external(externalDeps({ ...dependencies, ...peerDependencies })),
    plugins,
    globals,
    name,
    [{
        RemediationButton: 'src/RemediationButton.js',
        index: 'src/index.js'
    }, {
        RemediationButton: 'src/RemediationButton.js',
        index: 'src/index.js'
    }],
    './'
);
