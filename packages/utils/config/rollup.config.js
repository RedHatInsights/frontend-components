/* eslint-disable camelcase */
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import nodeGlobals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import { dependencies, peerDependencies, name } from '../package.json';
import { createFilter } from '@rollup/pluginutils';
import glob from 'glob';
import copy from 'rollup-plugin-copy';

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

const externalDeps = Object.keys({ ...dependencies, ...peerDependencies }).map(item =>
    (
        item.includes('@patternfly') ||
        item.includes('@redhat-cloud-services')
    ) &&
    !item.includes('@patternfly/react-table') ?
        `${item}/**` :
        item
);

const external = createFilter(
    externalDeps,
    null,
    { resolve: false }
);

const globals = {
    react: 'React',
    'react-dom': 'ReactDOM',
    'prop-types': 'prop-types',
    '@patternfly/react-core': '@patternfly/react-core',
    '@patternfly/react-icons': '@patternfly/react-icons',
    '@patternfly/react-table': '@patternfly/react-table',
    '@redhat-cloud-services/frontend-components': '@redhat-cloud-services/frontend-components'
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
        extract: true
    }),
    copy({
        targets: [
            { src: 'src/*.scss', dest: 'files/Utilities' }
        ]
    }),
    json()
];

export default [
    ...[ 'esm', 'cjs' ].map(env => ({
        input: entryMapper,
        output: {
            dir: `./files/${env}`,
            format: env,
            name,
            globals,
            exports: 'named'
        },
        external,
        plugins
    })),
    ...Object.entries(entryMapper).map(([ key, input ]) => ({
        input,
        output: {
            file: `./files/${key}.js`,
            format: 'umd',
            name: `${name}-${key}`,
            globals,
            exports: 'named'
        },
        external,
        plugins
    }))
];
