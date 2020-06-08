/* eslint-disable camelcase */
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import nodeGlobals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import { dependencies, name } from './package.json';
import {
    rollupConfig,
    externalDeps,
    external,
    globals,
    globMapper
} from '../../config/rollup-contants';

const commonjsOptions = {
    ignoreGlobal: true,
    include: /node_modules/
};

const babelOptions = {
    exclude: /node_modules/,
    runtimeHelpers: true,
    configFile: './babel.config'
};

const plugins = [
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

export default rollupConfig(
    external(externalDeps(dependencies)),
    plugins,
    globals,
    name,
    [ globMapper('src/**/index.js') ],
    './dist/'
);
