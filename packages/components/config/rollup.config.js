/* eslint-disable camelcase */
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import nodeGlobals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';
import scss from 'rollup-plugin-scss';
import json from '@rollup/plugin-json';
import packageImporter from 'node-sass-package-importer';
import { dependencies, peerDependencies, name } from '../package.json';
import {
    rollupConfig,
    globMapper,
    externalDeps,
    external,
    globals
} from '../../../config/rollup-contants';
import copy from 'rollup-plugin-copy';
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
        ],
        'src/Components/ConditionalFilter/ConditionalFilter.js': [
            'ConditionalFilterType'
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
    scss({
        output: 'index.css',
        outputStyle: 'compressed',
        importer: packageImporter()
    }),
    json(),
    copy({
        targets: [
            { src: 'src/**/*.scss', dest: './components' },
            { src: 'src/**/*.d.ts', dest: './components' }

        ],
        overwrite: true,
        hook: 'writeBundle'
    })
];

export default rollupConfig(
    external(externalDeps({ ...dependencies, ...peerDependencies })),
    plugins,
    globals,
    name,
    [ globMapper('src/**/index.js') ],
    './components/'
);
