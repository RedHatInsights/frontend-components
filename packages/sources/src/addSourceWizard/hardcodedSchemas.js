import React from 'react';
import { validatorTypes, componentTypes } from '@data-driven-forms/react-form-renderer';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import SSLFormLabel from './SSLFormLabel';

import * as OpenshiftToken from './hardcodedComponents/openshift/token';
import * as AwsSecret from './hardcodedComponents/aws/access_key';
import * as AwsArn from './hardcodedComponents/aws/arn';

import * as SWAwsArn from './hardcodedComponents/aws/subscriptionWatch';

import * as CMOpenshift from  './hardcodedComponents/openshift/costManagement';
import * as CMAzure from './hardcodedComponents/azure/costManagement';

export const COST_MANAGEMENT_APP_NAME = '/insights/platform/cost-management';
export const CLOUD_METER_APP_NAME = '/insights/platform/cloud-meter';
export const CATALOG_APP = '/insights/platform/catalog';

const arnField = {
    placeholder: 'arn:aws:iam:123456789:role/CostManagement',
    isRequired: true,
    validate: [{
        type: validatorTypes.REQUIRED
    },  {
        type: validatorTypes.PATTERN_VALIDATOR,
        pattern: /^arn:aws:.*/,
        message: 'ARN must start with arn:aws:'
    }, {
        type: validatorTypes.MIN_LENGTH,
        threshold: 10,
        message: 'ARN should have at least 10 characters'
    }]
};

const subsWatchArnField = {
    placeholder: 'arn:aws:iam:123456789:role/SubscriptionWatch',
    isRequired: true,
    validate: [{
        type: validatorTypes.REQUIRED
    }, {
        type: validatorTypes.PATTERN_VALIDATOR,
        pattern: /^arn:aws:.*/,
        message: 'ARN must start with arn:aws:'
    }, {
        type: validatorTypes.MIN_LENGTH,
        threshold: 10,
        message: 'ARN should have at least 10 characters'
    }],
    label: 'ARN'
};

export default {
    openshift: {
        authentication: {
            token: {
                generic: {
                    'authentication.password': {
                        isRequired: true,
                        validate: [{ type: validatorTypes.REQUIRED }]
                    },
                    additionalFields: [{
                        component: 'description',
                        name: 'description-summary',
                        Content: OpenshiftToken.DescriptionSummary
                    }]
                },
                [COST_MANAGEMENT_APP_NAME]: {
                    skipSelection: true,
                    skipEndpoint: true,
                    'source.source_ref': {
                        label: <CMOpenshift.ClusterIdentifierLabel />,
                        validate: [{
                            type: validatorTypes.REQUIRED
                        }, {
                            type: validatorTypes.PATTERN_VALIDATOR,
                            pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/,
                            message: 'Cluster ID must start with alphanumeric character and can contain underscore and hyphen'
                        }]
                    },
                    additionalSteps: [{
                        title: 'Install prerequisites',
                        nextStep: 'obtainLogin',
                        fields: [{
                            name: 'description',
                            component: 'description',
                            Content: CMOpenshift.PrerequisiteDescription
                        }, {
                            name: 'ocp-req',
                            component: componentTypes.CHECKBOX,
                            label: <CMOpenshift.PrerequisiteOCPText />,
                            isRequired: true,
                            validate: [{ type: validatorTypes.REQUIRED }]
                        }, {
                            name: 'ocp-req-list',
                            component: 'description',
                            Content: CMOpenshift.PrerequisiteOCPList
                        }, {
                            name: 'sys-req',
                            component: componentTypes.CHECKBOX,
                            label: <CMOpenshift.PrerequisiteSystemText />,
                            isRequired: true,
                            validate: [{ type: validatorTypes.REQUIRED }]
                        }, {
                            name: 'sys-req-list',
                            component: 'description',
                            Content: CMOpenshift.PrerequisiteSystemList
                        }, {
                            component: componentTypes.TEXT_FIELD,
                            name: 'authentication.authtype',
                            hideField: true,
                            initialValue: 'token',
                            initializeOnMount: true
                        }]
                    }, {
                        title: 'Obtain your login credentials',
                        stepKey: 'obtainLogin',
                        name: 'obtainLogin',
                        nextStep: 'usageCollector',
                        fields: [{
                            component: 'description',
                            name: 'description-summary',
                            Content: CMOpenshift.ObtainLoginDescription
                        }]
                    }, {
                        title: 'Configure usage collector',
                        stepKey: 'usageCollector',
                        name: 'usageCollector',
                        nextStep: 'dataCollection',
                        fields: [{
                            component: 'description',
                            name: 'description-summary',
                            Content: CMOpenshift.ConfigureUsageCollector
                        }]
                    }, {
                        title: 'Configure data collection',
                        stepKey: 'dataCollection',
                        name: 'dataCollection',
                        fields: [{
                            component: 'description',
                            name: 'description-summary',
                            Content: CMOpenshift.DataCollectionDescription
                        }]
                    }]
                }
            }
        },
        endpoint: {
            url: {
                placeholder: 'https://myopenshiftcluster.mycompany.com',
                isRequired: true,
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.URL, message: 'The URL is not formatted correctly.' }
                ]
            },
            'endpoint.certificate_authority': {
                label: <SSLFormLabel />,
                'aria-label': 'SSL Certificate'
            },
            additionalFields: [{
                component: 'description',
                name: 'description-summary',
                // eslint-disable-next-line react/display-name
                Content: () => (<TextContent key='2'>
                    <Text component={ TextVariants.p }>
                    Provide the OpenShift Container Platform URL and SSL certificate.
                    </Text>
                </TextContent>)
            }]
        }
    },
    azure: {
        authentication: {
            tenant_id_client_id_client_secret: {
                [COST_MANAGEMENT_APP_NAME]: {
                    skipSelection: true,
                    'credentials.subscription_id': {
                        placeholder: '',
                        validate: [{
                            type: validatorTypes.REQUIRED
                        }, {
                            type: validatorTypes.PATTERN_VALIDATOR,
                            pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/,
                            message: 'Subscription ID must start with alphanumeric character and can contain underscore and hyphen'
                        }],
                        isRequired: true
                    },
                    'billing_source.data_source.resource_group': {
                        placeholder: '',
                        validate: [{
                            type: validatorTypes.REQUIRED
                        }, {
                            type: validatorTypes.PATTERN_VALIDATOR,
                            pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/,
                            message: 'Resource group must start with alphanumeric character and can contain underscore and hyphen'
                        }],
                        isRequired: true
                    },
                    'billing_source.data_source.storage_account': {
                        placeholder: '',
                        validate: [{
                            type: validatorTypes.REQUIRED
                        }, {
                            type: validatorTypes.PATTERN_VALIDATOR,
                            pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/,
                            message: 'Storage account must start with alphanumeric character and can contain underscore and hyphen'
                        }],
                        isRequired: true
                    },
                    'authentication.password': {
                        isRequired: true,
                        type: 'password',
                        validate: [{
                            type: validatorTypes.REQUIRED
                        }],
                        label: 'Client secret'
                    },
                    'authentication.username': {
                        isRequired: true,
                        validate: [{
                            type: validatorTypes.REQUIRED
                        }],
                        label: 'Client (Application) ID'
                    },
                    'authentication.extra.azure.tenant_id': {
                        isRequired: true,
                        label: 'Tenant (Directory) ID',
                        validate: [{
                            type: validatorTypes.REQUIRED
                        }]
                    },
                    additionalSteps: [{
                        title: 'Configure resource group and storage account',
                        nextStep: 'service-principal',
                        fields: [{
                            component: componentTypes.TEXT_FIELD,
                            name: 'authentication.authtype',
                            hideField: true,
                            initialValue: 'tenant_id_client_id_client_secret',
                            initializeOnMount: true
                        }, {
                            name: 'azure-storage-account-description',
                            component: 'description',
                            Content: CMAzure.ConfigureResourceGroupAndStorageAccount
                        }, {
                            name: 'billing_source.data_source.resource_group',
                            component: componentTypes.TEXT_FIELD,
                            label: 'Resource group name'
                        }, {
                            name: 'billing_source.data_source.storage_account',
                            component: componentTypes.TEXT_FIELD,
                            label: 'Storage account name'
                        }]
                    }, {
                        title: 'Configure service principal',
                        stepKey: 'service-principal',
                        name: 'service-principal',
                        nextStep: 'export-schedule',
                        fields: [{
                            name: 'configure-service-principal',
                            component: 'description',
                            Content: CMAzure.ServicePrincipalDescription
                        }, {
                            name: 'credentials.subscription_id',
                            component: componentTypes.TEXT_FIELD,
                            label: 'Subscription ID'
                        }, {
                            name: 'active-directory-description',
                            component: 'description',
                            Content: CMAzure.CreateActiveDirectory
                        }, {
                            name: 'authentication.extra.azure.tenant_id',
                            component: componentTypes.TEXT_FIELD
                        }, {
                            name: 'authentication.username',
                            component: componentTypes.TEXT_FIELD
                        }, {
                            name: 'authentication.password',
                            component: componentTypes.TEXT_FIELD
                        }]
                    }, {
                        title: 'Create a daily export',
                        stepKey: 'export-schedule',
                        name: 'export-schedule',
                        fields: [{
                            name: 'export-schedule-description',
                            component: 'description',
                            Content: CMAzure.ExportSchedule
                        }]
                    }]
                }
            }
        }
    },
    amazon: {
        authentication: {
            access_key_secret_key: {
                generic: {
                    'authentication.username': {
                        label: 'Access key ID',
                        placeholder: 'AKIAIOSFODNN7EXAMPLE',
                        isRequired: true,
                        validate: [{ type: validatorTypes.REQUIRED }]
                    },
                    'authentication.password': {
                        label: 'Secret access key',
                        placeholder: 'wJairXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
                        isRequired: true,
                        validate: [{ type: validatorTypes.REQUIRED }]
                    },
                    skipSelection: true,
                    onlyHiddenFields: true,
                    additionalSteps: [{
                        title: 'Configure account access',
                        fields: [{
                            component: 'description',
                            name: 'description-summary',
                            Content: AwsSecret.DescriptionSummary
                        }, {
                            name: 'authentication.username',
                            component: componentTypes.TEXT_FIELD
                        }, {
                            name: 'authentication.password',
                            component: componentTypes.TEXT_FIELD
                        }, {
                            component: componentTypes.TEXT_FIELD,
                            name: 'authentication.authtype',
                            hideField: true,
                            initialValue: 'access_key_secret_key',
                            initializeOnMount: true
                        }]
                    }]
                }
            },
            arn: {
                generic: {
                    includeStepKeyFields: [ 'arn' ],
                    'authentication.password': arnField
                },
                [COST_MANAGEMENT_APP_NAME]: {
                    skipSelection: true,
                    'authentication.password': arnField,
                    'billing_source.bucket': {
                        placeholder: 'cost-usage-bucket',
                        validate: [{
                            type: validatorTypes.REQUIRED
                        }, {
                            type: validatorTypes.PATTERN_VALIDATOR,
                            pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/,
                            message: 'S3 bucket name must start with alphanumeric character and can contain underscore and hyphen'
                        }],
                        isRequired: true
                    },
                    additionalSteps: [{
                        title: 'Configure cost and usage reporting',
                        nextStep: 'tags',
                        fields: [{
                            name: 'usage-description',
                            component: 'description',
                            Content: AwsArn.UsageDescription
                        },  {
                            name: 'billing_source.bucket',
                            component: componentTypes.TEXT_FIELD,
                            label: 'S3 bucket name'
                        }, {
                            component: componentTypes.TEXT_FIELD,
                            name: 'authentication.authtype',
                            hideField: true,
                            initialValue: 'arn',
                            initializeOnMount: true
                        }]
                    }, {
                        title: 'Activate cost allocation tags',
                        stepKey: 'tags',
                        name: 'tags',
                        nextStep: 'iam-policy',
                        fields: [{
                            name: 'tags-description',
                            component: 'description',
                            Content: AwsArn.TagsDescription
                        }]
                    },
                    {
                        title: 'Create IAM policy',
                        stepKey: 'iam-policy',
                        name: 'iam-policy',
                        nextStep: 'iam-role',
                        substepOf: 'Enable account access',
                        fields: [{
                            name: 'iam-policy-description',
                            component: 'description',
                            Content: AwsArn.IAMPolicyDescription
                        }]
                    }, {
                        title: 'Create IAM role',
                        stepKey: 'iam-role',
                        name: 'iam-role',
                        nextStep: 'arn',
                        substepOf: 'Enable account access',
                        fields: [{
                            name: 'iam-role-description',
                            component: 'description',
                            Content: AwsArn.IAMRoleDescription
                        }]
                    }, {
                        title: 'Enter ARN',
                        stepKey: 'arn',
                        name: 'arn',
                        substepOf: 'Enable account access',
                        fields: [{
                            name: 'arn-description',
                            component: 'description',
                            Content: AwsArn.ArnDescription
                        }]
                    }]
                }
            },
            'cloud-meter-arn': {
                [CLOUD_METER_APP_NAME]: {
                    skipSelection: true,
                    'authentication.password': subsWatchArnField,
                    additionalSteps: [{
                        title: 'Create IAM policy',
                        name: 'iam-policy',
                        nextStep: 'subs-iam-role',
                        substepOf: 'Enable account access',
                        fields: [{
                            name: 'iam-policy-description',
                            component: 'description',
                            Content: SWAwsArn.IAMPolicyDescription
                        }]
                    }, {
                        title: 'Create IAM role',
                        stepKey: 'subs-iam-role',
                        name: 'subs-iam-role',
                        nextStep: 'subs-arn',
                        substepOf: 'Enable account access',
                        fields: [{
                            name: 'iam-role-description',
                            component: 'description',
                            Content: SWAwsArn.IAMRoleDescription
                        }]
                    }, {
                        title: 'Enter ARN',
                        stepKey: 'subs-arn',
                        name: 'cloud-meter-arn',
                        substepOf: 'Enable account access',
                        fields: [{
                            name: 'arn-description',
                            component: 'description',
                            Content: SWAwsArn.ArnDescription
                        }, {
                            component: componentTypes.TEXT_FIELD,
                            name: 'authentication.password'
                        }]
                    }
                    ]
                }
            }
        },
        endpoint: {}
    },
    satellite: {
        endpoint: {},
        authentication: {
            receptor_node: {
                generic: {
                    'source.source_ref': {
                        label: 'Satellite ID',
                        isRequired: true,
                        validate: [{ type: validatorTypes.REQUIRED }],
                        component: componentTypes.TEXT_FIELD
                    },
                    'endpoint.receptor_node': {
                        label: 'Receptor ID',
                        isRequired: true,
                        validate: [{ type: validatorTypes.REQUIRED }],
                        component: componentTypes.TEXT_FIELD
                    },
                    skipSelection: true,
                    onlyHiddenFields: true,
                    customSteps: true,
                    additionalSteps: [{
                        title: 'Configure receptor node credentials',
                        nextStep: 'summary',
                        fields: [{
                            name: 'source.source_ref'
                        }, {
                            name: 'endpoint.receptor_node'
                        }, {
                            component: componentTypes.TEXT_FIELD,
                            name: 'endpoint.role',
                            hideField: true,
                            initializeOnMount: true,
                            initialValue: 'sattelite'
                        }, {
                            component: componentTypes.TEXT_FIELD,
                            name: 'authentication.authtype',
                            hideField: true,
                            initializeOnMount: true,
                            initialValue: 'receptor_node'
                        }]
                    }]
                }
            }
        }
    },
    'ansible-tower': {
        authentication: {
            username_password: {
                [CATALOG_APP]: {
                    skipSelection: true,
                    'authentication.username': {
                        isRequired: true,
                        validate: [{ type: validatorTypes.REQUIRED }],
                        label: 'Username'
                    },
                    'authentication.password': {
                        type: 'password',
                        isRequired: true,
                        validate: [{ type: validatorTypes.REQUIRED }],
                        label: 'Password'
                    },
                    additionalSteps: [{
                        title: 'Configure credentials',
                        name: 'catalog-ansible-tower',
                        fields: [{
                            component: componentTypes.TEXT_FIELD,
                            name: 'authentication.authtype',
                            hideField: true,
                            initialValue: 'username_password',
                            initializeOnMount: true
                        }, {
                            component: componentTypes.TEXT_FIELD,
                            name: 'authentication.username'
                        }, {
                            component: componentTypes.TEXT_FIELD,
                            name: 'authentication.password'
                        }]
                    }]
                }
            }
        },
        endpoint: {
            url: {
                isRequired: true,
                validate: [{ type: validatorTypes.REQUIRED }],
                placeholder: 'https://'
            },
            'endpoint.certificate_authority': {
                label: 'Certificate authority'
            },
            'endpoint.verify_ssl': {
                initialValue: false
            }
        }
    }
};
