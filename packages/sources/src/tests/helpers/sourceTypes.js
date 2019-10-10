export default [
    {
        created_at: '2019-03-26T14:05:45Z',
        icon_url: '/openshift_logo.png',
        id: '1',
        name: 'openshift',
        product_name: 'OpenShift Container Platform',
        schema: {
            authentication: [{
                type: 'token',
                name: 'Token',
                fields: [
                    {
                        component: 'text-field',
                        name: 'authentication.authtype',
                        hideField: true,
                        initialValue: 'token'
                    },
                    {
                        component: 'text-field',
                        name: 'authentication.password',
                        label: 'Token',
                        type: 'password'
                    }
                ]
            }],
            endpoint: {
                title: 'Configure OpenShift endpoint',
                fields: [
                    {
                        component: 'text-field',
                        name: 'endpoint.role',
                        hideField: true,
                        initialValue: 'kubernetes'
                    },
                    {
                        component: 'text-field',
                        name: 'url',
                        label: 'URL',
                        validate: [
                            {
                                type: 'url-validator'
                            }
                        ]
                    },
                    {
                        component: 'checkbox',
                        name: 'endpoint.verify_ssl',
                        label: 'Verify SSL'
                    },
                    {
                        component: 'text-field',
                        name: 'endpoint.certificate_authority',
                        label: 'Certificate Authority',
                        condition: {
                            when: 'endpoint.verify_ssl',
                            is: true
                        }
                    }
                ]
            }
        },
        updated_at: '2019-09-16T14:03:35Z',
        vendor: 'Red Hat'
    },
    {
        created_at: '2019-03-26T14:05:45Z',
        icon_url: '/aws_logo.png',
        id: '2',
        name: 'amazon',
        product_name: 'Amazon Web Services',
        schema: {
            authentication: [
                {
                    type: 'access_key_secret_key',
                    name: 'AWS Secret Key',
                    fields: [
                        {
                            component: 'text-field',
                            name: 'authentication.authtype',
                            hideField: true,
                            initialValue: 'access_key_secret_key'
                        },
                        {
                            component: 'text-field',
                            name: 'authentication.username',
                            label: 'Access Key'
                        },
                        {
                            component: 'text-field',
                            name: 'authentication.password',
                            label: 'Secret Key',
                            type: 'password'
                        }
                    ]
                },
                {
                    type: 'arn',
                    name: 'ARN',
                    fields: [
                        {
                            component: 'text-field',
                            name: 'authentication.authtype',
                            hideField: true,
                            initialValue: 'arn'
                        },
                        {
                            component: 'text-field',
                            name: 'authentication.password',
                            label: 'ARN',
                            type: 'password'
                        }
                    ],
                    additional_steps: [{
                        title: 'ARN amazon bucket',
                        substep: 'ARN',
                        fields: [
                            {
                                label: 'Additional CostManagement field',
                                component: 'text-field',
                                name: 'cost_management.bucket',
                                description: 'description',
                                helperText: 'helperText'
                            }
                        ]
                    }]
                }
            ],
            endpoint: {
                hidden: true,
                fields: [
                    {
                        component: 'text-field',
                        name: 'endpoint.role',
                        hideField: true,
                        initialValue: 'aws'
                    }
                ]
            }
        },
        updated_at: '2019-09-11T14:03:04Z',
        vendor: 'Amazon'
    },
    {
        created_at: '2019-04-05T17:54:38Z',
        id: '3',
        name: 'ansible-tower',
        product_name: 'Ansible Tower',
        schema: {
            authentication: [{
                type: 'username_password',
                name: 'Username and password',
                fields: [
                    {
                        component: 'text-field',
                        name: 'authentication.authtype',
                        hideField: true,
                        initialValue: 'username_password'
                    },
                    {
                        component: 'text-field',
                        name: 'authentication.username',
                        label: 'User name'
                    },
                    {
                        component: 'text-field',
                        name: 'authentication.password',
                        label: 'Secret Key',
                        type: 'password'
                    }
                ]

            }],
            endpoint: {
                title: 'Configure Ansible Tower endpoint',
                fields: [
                    {
                        component: 'text-field',
                        name: 'endpoint.role',
                        hideField: true,
                        initialValue: 'ansible'
                    },
                    {
                        component: 'text-field',
                        name: 'url',
                        label: 'URL',
                        validate: [
                            {
                                type: 'url-validator'
                            }
                        ]
                    },
                    {
                        component: 'checkbox',
                        name: 'endpoint.verify_ssl',
                        label: 'Verify SSL'
                    },
                    {
                        component: 'text-field',
                        name: 'endpoint.certificate_authority',
                        label: 'Certificate Authority',
                        condition: {
                            when: 'endpoint.verify_ssl',
                            is: true
                        }
                    }
                ]
            }
        },
        updated_at: '2019-09-16T14:03:35Z',
        vendor: 'Red Hat'
    },
    {
        created_at: '2019-07-16T13:52:12Z',
        icon_url: '/vsphere_logo.png',
        id: '4',
        name: 'vsphere',
        product_name: 'VMware vSphere',
        updated_at: '2019-08-30T13:52:33Z',
        vendor: 'VMware'
    },
    {
        created_at: '2019-07-16T13:52:12Z',
        id: '5',
        name: 'ovirt',
        product_name: 'Red Hat Virtualization',
        updated_at: '2019-07-16T13:52:12Z',
        vendor: 'Red Hat'
    },
    {
        created_at: '2019-07-16T13:52:12Z',
        id: '6',
        name: 'openstack',
        product_name: 'Red Hat OpenStack',
        updated_at: '2019-07-16T13:52:12Z',
        vendor: 'Red Hat'
    },
    {
        created_at: '2019-07-16T13:52:12Z',
        id: '7',
        name: 'cloudforms',
        product_name: 'Red Hat CloudForms',
        updated_at: '2019-07-16T13:52:12Z',
        vendor: 'Red Hat'
    },
    {
        created_at: '2019-08-19T14:53:02Z',
        id: '8',
        name: 'azure',
        product_name: 'Microsoft Azure',
        schema: {
            authentication: [{
                type: 'access_key_secret_key',
                name: 'Username and password',
                fields: [
                    {
                        component: 'text-field',
                        name: 'authentication.authtype',
                        hideField: true,
                        initialValue: 'access_key_secret_key'
                    },
                    {
                        component: 'text-field',
                        name: 'authentication.extra.azure.tenant_id',
                        label: 'Tenant ID'
                    },
                    {
                        component: 'text-field',
                        name: 'authentication.username',
                        label: 'Client ID'
                    },
                    {
                        component: 'text-field',
                        name: 'authentication.password',
                        label: 'Client Secret',
                        type: 'password'
                    }
                ]

            }],
            endpoint: {
                hidden: true,
                fields: [
                    {
                        component: 'text-field',
                        name: 'endpoint.role',
                        hideField: true,
                        initialValue: 'azure'
                    }
                ]
            }
        },
        updated_at: '2019-09-11T14:03:04Z',
        vendor: 'Azure'
    }
];
