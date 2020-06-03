import glob from 'glob';
import { createFilter } from '@rollup/pluginutils';

export const globMapper = (mapper) => glob.sync(mapper).reduce((acc, item) => {
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

export const externalDeps = (
    dependencies = {},
    externals = [ '@patternfly', '@redhat-cloud-services' ],
    ignores = [ '@patternfly/react-table' ]
) => Object.keys(dependencies).map(item =>
    externals.some(external => item.includes(external)) && ignores.every(ignored => !item.includes(ignored)) ?
        `${item}/**` :
        item
);

export const external = (externalDeps) => createFilter(
    [
        ...externalDeps,
        'react',
        'react-dom'
    ],
    null,
    { resolve: false }
);

export const globals = {
    react: 'React',
    'react-dom': 'ReactDOM',
    'prop-types': 'prop-types',
    '@patternfly/react-core': '@patternfly/react-core',
    '@patternfly/react-icons': '@patternfly/react-icons',
    '@patternfly/react-table': '@patternfly/react-table',
    '@redhat-cloud-services/frontend-components': '@redhat-cloud-services/frontend-components',
    'react-router-dom': 'reactRouterDom',
    classnames: 'classNames',
    'react-redux': 'reactRedux'
};

export const rollupConfig = (external, plugins, globals, name, entries = [ globMapper('src/**/index.js') ], outputDir = './') => ([
    ...[ 'esm', 'cjs' ].map(env => ({
        input: entries[0],
        output: {
            dir: `${outputDir}${env}`,
            format: env,
            name,
            globals,
            exports: 'named'
        },
        external,
        plugins
    })),
    ...Object.entries(entries[1] || entries[0]).map(([ key, input ]) => ({
        input,
        output: {
            file: `${outputDir}${key}.js`,
            format: 'umd',
            name: `${name}-${key}`,
            globals,
            exports: 'named'
        },
        external,
        plugins
    }))
]);
