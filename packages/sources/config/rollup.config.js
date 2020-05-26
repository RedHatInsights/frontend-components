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

const entryMapper = {
    index: 'src/index.js',
    addSourceWizard: 'src/addSourceWizard/index.js',
    SourceAddSchema: 'src/addSourceWizard/SourceAddSchema.js',
    schemaBuilder: 'src/addSourceWizard/schemaBuilder.js',
    sourceFormRenderer: 'src/sourceFormRenderer/index.js',
    createSource: 'src/api/createSource.js',
    costManagementAuthentication: 'src/api/costManagementAuthentication.js',
    handleError: 'src/api/handleError.js',
    filterApps: 'src/utilities/filterApps.js',
    CloseModal: 'src/addSourceWizard/CloseModal.js',
    hardcodedSchemas: 'src/addSourceWizard/hardcodedSchemas.js',
    AuthSelect: 'src/sourceFormRenderer/components/AuthSelect.js',
    CardSelect: 'src/sourceFormRenderer/components/CardSelect.js',
    SourceWizardSummary: 'src/sourceFormRenderer/components/SourceWizardSummary.js'
};

const globMapper = (mapper) => glob.sync(mapper).reduce((acc, item) => {
    const [ path ] = item.split('/index.js');
    const last = path.split('/').pop();

    if (item.includes('.test.js')) {
        return acc;
    }

    return {
        ...acc,
        [last === 'src' ? 'index' : last.replace('.js', '')]: item
    };
}, {});

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
    json()
];

export default [
    ...[ 'esm', 'cjs' ].map(env => ({
        input: entryMapper,
        output: {
            dir: `./${env}`,
            format: env,
            name,
            globals,
            exports: 'named'
        },
        external,
        plugins
    })),
    ...Object.entries(globMapper('src/index.js')).map(([ key, input ]) => ({
        input,
        output: {
            file: `./${key}.js`,
            format: 'umd',
            name: `${name}-${key}`,
            globals,
            exports: 'named'
        },
        external,
        plugins
    }))
];
