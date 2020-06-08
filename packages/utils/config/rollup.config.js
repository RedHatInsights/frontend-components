/* eslint-disable camelcase */
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import nodeGlobals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import { dependencies, peerDependencies, name } from '../package.json';
import copy from 'rollup-plugin-copy';
import {
    rollupConfig,
    externalDeps,
    external,
    globals
} from '../../../config/rollup-contants';

const entryMapper = {
    ReducerRegistry: './src/ReducerRegistry.js',
    helpers: './src/helpers.js',
    MiddlewareListener: './src/MiddlewareListener.js',
    Registry: './src/Registry.js',
    Deffered: './src/Deffered.js',
    RouterParams: './src/RouterParams.js',
    interceptors: './src/interceptors.js',
    debounce: './src/debounce.js',
    inventoryDependencies: './src/inventoryDependencies.js',
    RBAC: './src/RBAC.js',
    RBACHook: './src/RBACHook.js'
};

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
    nodeResolve(),
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
    copy({
        targets: [
            { src: 'src/*.scss', dest: 'files/Utilities' }
        ]
    }),
    json()
];

export default rollupConfig(
    external(externalDeps({ ...dependencies, ...peerDependencies })),
    plugins,
    globals,
    name,
    [ entryMapper ],
    './files/'
);
