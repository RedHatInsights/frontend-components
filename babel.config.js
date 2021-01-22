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

const frontendComponentsMappe = {
    CullingInformation: 'CullingInfo',
    CriticalBattery: 'Battery',
    HighBattery: 'Battery',
    MediumBattery: 'Battery',
    LowBattery: 'Battery',
    NullBattery: 'Battery',
    ConnectedBreadcrumbs: 'Breadcrumbs',
    ConditionalFilterType: 'ConditionalFilter',
    conditionalFilterType: 'ConditionalFilter',
    groupType: 'ConditionalFilter',
    DarkContext: 'Dark',
    FilterDropdown: 'Filters',
    FilterInput: 'Filters',
    LabeledInput: 'Input',
    PageHeaderTitle: 'PageHeader',
    dropDirection: 'Pagination',
    SkeletonSize: 'Skeleton',
    SortDirection: 'Table',
    TableVariant: 'Table',
    TableHeader: 'Table',
    TableBody: 'Table',
    TableFooter: 'Table',
    useTagsFilter: 'FilterHooks',
    tagsFilterState: 'FilterHooks',
    tagsFilterReducer: 'FilterHooks'
};

const iconMapper = {
    AnsibeTowerIcon: 'ansibeTower-icon',
    ChartSpikeIcon: 'chartSpike-icon'
};

const notificationsMapper = {
    REMOVE_NOTIFICATION: 'actionTypes',
    ADD_NOTIFICATION: 'actionTypes',
    NotificationsPortal: 'NotificationPortal',
    addNotification: 'actions'
};

const inventoryMapper = {
    loadEntity: 'actions'
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

const createFrontendComponentsTransform = env => [
    'transform-imports',
    {
        '@redhat-cloud-services/frontend-components-charts': {
            transform: (importName) => `@redhat-cloud-services/frontend-components-charts/dist/${env}/${importName}.js`,
            preventFullImport: true,
            skipDefaultConversion: true
        },
        '@redhat-cloud-services/frontend-components-remediations': {
            transform: (importName) => `@redhat-cloud-services/frontend-components-remediations/${
                env
            }/${
                importName === 'RemediationButton' ? 'RemediationButton.js' : 'index.js'
            }`,
            preventFullImport: false,
            skipDefaultConversion: false
        },
        '@redhat-cloud-services/rule-components': {
            transform: (importName) => `@redhat-cloud-services/rule-components/dist/${env}/${importName}.js`,
            preventFullImport: true,
            skipDefaultConversion: true
        },
        '@redhat-cloud-services/frontend-components-utilities': {
            transform: (importName) => `@redhat-cloud-services/frontend-components-utilities/files/${env}/${importName}.js`,
            preventFullImport: true,
            skipDefaultConversion: true
        },
        '@redhat-cloud-services/frontend-components-inventory': {
            transform: (importName) => `@redhat-cloud-services/frontend-components-inventory/${env}/${inventoryMapper[importName] || importName}.js`,
            preventFullImport: true,
            skipDefaultConversion: true
        },
        '@redhat-cloud-services/frontend-components-inventory-compliance': {
            transform: (importName) => `@redhat-cloud-services/frontend-components-inventory-compliance/${env}/${importName}.js`,
            preventFullImport: true,
            skipDefaultConversion: true
        },
        '@redhat-cloud-services/frontend-components-inventory-general-info': {
            transform: (importName) => `@redhat-cloud-services/frontend-components-inventory-general-info/${env}/${importName}.js`,
            preventFullImport: true,
            skipDefaultConversion: true
        },
        '@redhat-cloud-services/frontend-components-inventory-insights': {
            transform: (importName) => `@redhat-cloud-services/frontend-components-inventory-insights/${env}/${importName}.js`,
            preventFullImport: true,
            skipDefaultConversion: true
        },
        '@redhat-cloud-services/frontend-components-notifications': {
            transform: (importName) => `@redhat-cloud-services/frontend-components-notifications/${env}/${notificationsMapper[importName] || importName}.js`,
            preventFullImport: true,
            skipDefaultConversion: true
        },
        '@redhat-cloud-services/frontend-components-sources': {
            transform: (importName) => `@redhat-cloud-services/frontend-components-sources/${env}/${importName}.js`,
            preventFullImport: true,
            skipDefaultConversion: true
        },
        '@redhat-cloud-services/frontend-components-translations': {
            transform: (importName) => `@redhat-cloud-services/frontend-components-translations/${env}/${importName}.js`,
            preventFullImport: true,
            skipDefaultConversion: true
        },
        '@redhat-cloud-services/frontend-components': {
            transform: (importName) => `@redhat-cloud-services/frontend-components/components/${env}/${frontendComponentsMappe[importName] || importName}.js`,
            preventFullImport: true,
            skipDefaultConversion: true
        }
    },
    'fce-transform'
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
            plugins: [
                createPfReactTransform('js'),
                createFrontendComponentsTransform('cjs')
            ]
        },
        esm: {
            plugins: [
                createPfReactTransform('esm'),
                createFrontendComponentsTransform('esm')
            ]
        }
    }
};
