import React from 'react';
import { validatorTypes, componentTypes } from '@data-driven-forms/react-form-renderer';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import SSLFormLabel from './SSLFormLabel';

import * as OpenshiftToken from './hardcodedComponents/openshift/token';
import * as AwsSecret from './hardcodedComponents/aws/access_key';
import * as AwsArn from './hardcodedComponents/aws/arn';

import * as CMOpenshift from  './hardcodedComponents/openshift/costManagement';
import * as CMAzure from './hardcodedComponents/azure/costManagement';

export const COST_MANAGEMENT_APP_NAME = '/insights/platform/cost-management';

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
                            initialValue: 'token'
                        }]
                    }, {
                        title: 'Obtain your login credentials',
                        stepKey: 'obtainLogin',
                        nextStep: 'usageCollector',
                        fields: [{
                            component: 'description',
                            name: 'description-summary',
                            Content: CMOpenshift.ObtainLoginDescription
                        }]
                    }, {
                        title: 'Configure usage collector',
                        stepKey: 'usageCollector',
                        nextStep: 'dataCollection',
                        fields: [{
                            component: 'description',
                            name: 'description-summary',
                            Content: CMOpenshift.ConfigureUsageCollector
                        }]
                    }, {
                        title: 'Configure data collection',
                        stepKey: 'dataCollection',
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
                label: <SSLFormLabel />
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
                    additionalSteps: [{
                        title: 'Configure resource group and storage account',
                        nextStep: 'service-principal',
                        fields: [{
                            component: componentTypes.TEXT_FIELD,
                            name: 'authentication.authtype',
                            hideField: true,
                            initialValue: 'tenant_id_client_id_client_secret'
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
                            component: componentTypes.TEXT_FIELD,
                            isRequired: true,
                            label: 'Tenant (Directory) ID'
                        }, {
                            name: 'authentication.username',
                            component: componentTypes.TEXT_FIELD,
                            isRequired: true,
                            label: 'Client (Application) ID'
                        }, {
                            name: 'authentication.password',
                            component: componentTypes.TEXT_FIELD,
                            isRequired: true,
                            type: 'password',
                            label: 'Client secret'
                        }]
                    }, {
                        title: 'Create a daily export',
                        stepKey: 'export-schedule',
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
                            initialValue: 'access_key_secret_key'
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
                            initialValue: 'arn'
                        }]
                    }, {
                        title: 'Activate cost allocation tags',
                        stepKey: 'tags',
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
                        nextStep: 'iam-role',
                        substepOf: 'Enable account access',
                        fields: [{
                            name: 'iam-policy-description',
                            component: 'description',
                            Content: AwsArn.IAMPolicyDescription,
                            assignFormOptions: true
                        }]
                    }, {
                        title: 'Create IAM role',
                        stepKey: 'iam-role',
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
                        substepOf: 'Enable account access',
                        fields: [{
                            name: 'arn-description',
                            component: 'description',
                            Content: AwsArn.ArnDescription
                        }]
                    }]
                }
            }
        },
        endpoint: {}
    }
};
