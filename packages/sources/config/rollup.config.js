/* eslint-disable camelcase */
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import nodeGlobals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import { dependencies, peerDependencies, devDependencies, name } from '../package.json';
import {
    rollupConfig,
    externalDeps,
    external,
    globals
} from '../../../config/rollup-contants';

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
        extract: true,
        minimize: true
    }),
    json()
];

export default rollupConfig(
    external(externalDeps(
        { ...dependencies, ...peerDependencies, ...devDependencies },
        [ '@patternfly', '@redhat-cloud-services',  '@data-driven-forms', 'lodash', 'react-intl', 'react-router-dom' ]
    )),
    plugins,
    {
        ...globals,
        '@data-driven-forms/pf4-component-mapper': '@data-driven-forms/pf4-component-mapper',
        '@data-driven-forms/react-form-renderer': '@data-driven-forms/react-form-renderer',
        '@redhat-cloud-services/frontend-components-utilities': '@redhat-cloud-services/frontend-components-utilities',
        lodash: 'lodash',
        'react-intl': 'react-intl',
        'react-router-dom': 'react-router-dom'
    },
    name,
    [{
        index: 'src/index.js',
        addSourceWizard: 'src/addSourceWizard/index.js',
        SourceAddSchema: 'src/addSourceWizard/SourceAddSchema.js',
        schemaBuilder: 'src/addSourceWizard/schemaBuilder.js',
        sourceFormRenderer: 'src/sourceFormRenderer/index.js',
        createSource: 'src/api/createSource.js',
        costManagementAuthentication: 'src/api/costManagementAuthentication.js',
        handleError: 'src/api/handleError.js',
        filterApps: 'src/utilities/filterApps.js',
        filterTypes: 'src/utilities/filterTypes.js',
        CloseModal: 'src/addSourceWizard/CloseModal.js',
        hardcodedSchemas: 'src/addSourceWizard/hardcodedSchemas.js',
        AuthSelect: 'src/sourceFormRenderer/components/AuthSelect.js',
        CardSelect: 'src/sourceFormRenderer/components/CardSelect.js',
        SourceWizardSummary: 'src/sourceFormRenderer/components/SourceWizardSummary.js',
        LoadingStep: 'src/addSourceWizard/steps/LoadingStep',
        FinishedStep: 'src/addSourceWizard/steps/FinishedStep',
        ErroredStep: 'src/addSourceWizard/steps/ErroredStep',
        TimeoutStep: 'src/addSourceWizard/steps/TimeoutStep',
        getApplicationStatus: 'src/api/getApplicationStatus.js',
        constants: 'src/api/constants.js',
        validated: 'src/sourceFormRenderer/resolveProps/validated.js'
    }, {
        index: 'src/index.js'
    }],
    './'
);
