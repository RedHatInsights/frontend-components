/* eslint-disable camelcase */
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import nodeGlobals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import { dependencies, name } from './package.json';
import { createFilter } from '@rollup/pluginutils';
import glob from 'glob';

const globMapper = (mapper) => glob.sync(mapper).reduce((acc, item) => {
    const [ path ] = item.split('/index.js');
    const last = path.split('/').pop();

    return {
        ...acc,
        [last === 'src' ? 'index' : last]: item
    };
}, {});

const externalDeps = Object.keys(dependencies).map(item =>
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
    '@redhat-cloud-services/frontend-components': '@redhat-cloud-services/frontend-components',
    '@data-driven-forms/react-form-renderer': '@data-driven-forms/react-form-renderer',
    '@data-driven-forms/pf4-component-mapper': '@data-driven-forms/pf4-component-mapper'
};

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
    json()
];

export default [
    ...[ 'esm', 'cjs' ].map(env => ({
        input: globMapper('src/**/index.js'),
        output: {
            dir: `./dist/${env}`,
            format: env,
            name,
            globals,
            exports: 'named'
        },
        external,
        plugins
    })),
    ...Object.entries(globMapper('src/**/index.js')).map(([ key, input ]) => ({
        input,
        output: {
            file: `./dist/umd/${key}.js`,
            format: 'umd',
            name: `${name}-${key}`,
            globals,
            exports: 'named'
        },
        external,
        plugins
    }))
];
