const applicationTypes = [
    {
        created_at: '2019-04-05T17:54:38Z',
        dependent_applications: [
            '/insights/platform/topological-inventory'
        ],
        display_name: 'Catalog',
        id: '1',
        name: '/insights/platform/catalog',
        supported_authentication_types: {
            'ansible-tower': [
                'username_password',
                'receptor_node'
            ]
        },
        supported_source_types: [
            'ansible-tower'
        ],
        updated_at: '2019-09-23T14:04:02Z'
    },
    {
        created_at: '2019-04-05T17:54:38Z',
        dependent_applications: [

        ],
        display_name: 'Cost Management',
        id: '2',
        name: '/insights/platform/cost-management',
        supported_authentication_types: {
            azure: [
                'tenant_id_client_id_client_secret'
            ],
            amazon: [
                'arn'
            ],
            openshift: [
                'token'
            ]
        },
        supported_source_types: [
            'amazon',
            'azure',
            'openshift'
        ],
        updated_at: '2019-09-16T19:56:12Z'
    },
    {
        created_at: '2019-04-05T17:54:38Z',
        dependent_applications: [

        ],
        display_name: 'Topological Inventory',
        id: '3',
        name: '/insights/platform/topological-inventory',
        supported_authentication_types: {
            azure: [
                'tenant_id_client_id_client_secret'
            ],
            amazon: [
                'access_key_secret_key'
            ],
            openshift: [
                'token'
            ],
            'ansible-tower': [
                'username_password'
            ]
        },
        supported_source_types: [
            'amazon',
            'ansible-tower',
            'azure',
            'openshift'
        ],
        updated_at: '2019-09-23T14:04:02Z'
    }
];

export default applicationTypes;

export const COST_MANAGEMENT_APP = applicationTypes[1];
export const TOPOLOGY_INV_APP = applicationTypes[2];
