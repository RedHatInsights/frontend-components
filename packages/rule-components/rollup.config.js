/* eslint-disable camelcase */

import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import nodeGlobals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import analyze from 'rollup-plugin-analyzer';
import { dependencies, name } from './package.json';
import { createFilter } from 'rollup-pluginutils';
import glob from 'glob';

const globMapper = (mapper) => glob.sync(mapper).reduce((acc, item) => {
    const [ path ] = item.split('/index.js');
    const last = path.split('/').pop();

    return {
        ...acc,
        [last === 'src' ? 'index' : last]: item
    };
}, {});

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
    include: /node_modules/,
    namedExports: {
        'node_modules/@redhat-cloud-services/frontend-components/components/PrimaryToolbar.js': [
            'PrimaryToolbar'
        ],
        'node_modules/@redhat-cloud-services/frontend-components/components/Skeleton.js': [
            'Skeleton'
        ],
        'node_modules/@redhat-cloud-services/frontend-components/components/TableToolbar.js': [
            'TableToolbar'
        ],
        'node_modules/@redhat-cloud-services/frontend-components/components/Battery.js': [
            'Battery'
        ],
        'node_modules/@redhat-cloud-services/frontend-components/components/Shield.js': [
            ''
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
        inject: true
    }),
    analyze({ summaryOnly: true }),
    json()
];

export default [
    ...[ 'cjs', 'esm' ].map(env => ({
        input: globMapper('src/**/index.js'),
        output: {
            dir: `./dist/${env}`,
            format: env,
            name,
            globals
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
            globals
        },
        external,
        plugins
    }))
];
