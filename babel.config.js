require.extensions['.css'] = () => undefined;
const path = require('path');
const glob = require('glob');

const mapper = {
    TextVariants: 'Text',
    ButtonVariant: 'Button',
    PaginationVariant: 'Pagination',
    SelectVariant: 'selectConstants',
    EmptyStateVariant: 'EmptyState',
    DropdownPosition: 'dropdownConstants',
    TextListVariants: 'TextList',
    TextListItemVariants: 'TextListItem',
    ClipboardCopyVariant: 'ClipboardCopy',
    TooltipPosition: 'Tooltip'
};

const iconMapper = {
    AnsibeTowerIcon: 'ansibeTower-icon',
    ChartSpikeIcon: 'chartSpike-icon',
    CloudServerIcon: 'cloudServer-icon'
};

const createPfReactTransform = (env) => [
    'transform-imports',
    {
        '@patternfly/react-core': {
            transform: (importName) => {
                let res;
                const pathname = path.resolve(__dirname, `node_modules/@patternfly/react-core/dist/${env}/**/${mapper[importName] || importName}.js`);
                const files = glob.sync(pathname);
                if (files.length > 0) {
                    res = files[0];
                } else {
                    throw new Error(`File with importName ${importName} does not exist. Glob path: ${pathname}`);
                }

                res = res.split('/node_modules/').pop();
                res = res.replace(/^\//, '');
                return res;
            },
            preventFullImport: false,
            skipDefaultConversion: true
        },
        '@patternfly/react-icons': {
            transform: (importName) =>
                `@patternfly/react-icons/dist/${env}/icons/${iconMapper[importName] || importName
                .split(/(?=[A-Z])/)
                .join('-')
                .toLowerCase()}`,
            preventFullImport: true
        },
        'patternfly-react': {
            transform: (importName) => {
                let res;
                const files = glob.sync(path.resolve(__dirname, `../../node_modules/patternfly-react/dist/${env}/**/${importName}.js`));
                if (files.length > 0) {
                    res = files[0];
                } else {
                    throw new Error(`File with importName ${importName} does not exist`);
                }

                res = res.split('/node_modules/').pop();
                res = res.replace(/^\//, '');
                return res;
            },
            preventFullImport: false,
            skipDefaultConversion: false
        }
    },
    `pf-react-${env}`
];

module.exports = {
    presets: [
        [
            '@babel/env',
            {
                targets: '> 0.25%, not dead'
            }
        ],
        '@babel/react'
    ],
    plugins: [
        [
            '@babel/plugin-proposal-decorators',
            {
                legacy: true
            }
        ],
        '@babel/plugin-transform-runtime',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-object-rest-spread',
        'babel-plugin-lodash',
        '@babel/plugin-transform-react-display-name',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-optional-chaining',
        [
            'react-intl',
            {
                messagesDir: './build/messages/'
            }
        ]
    ],
    env: {
        cjs: {
            presets: [ [ '@babel/preset-env', { modules: 'commonjs' }] ],
            plugins: [
                './plugins/transform-scss-plugin',
                createPfReactTransform('js')
            ]
        },
        esm: {
            presets: [ [ '@babel/preset-env', { modules: false }] ],
            plugins: [
                [
                    './plugins/transform-scss-plugin',
                    {
                        esm: true
                    }
                ],
                createPfReactTransform('esm')
            ]
        }
    }
};
