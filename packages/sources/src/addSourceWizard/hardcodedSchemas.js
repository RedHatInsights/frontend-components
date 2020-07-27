import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FormHelperText } from '@patternfly/react-core';

import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import SSLFormLabel from './SSLFormLabel';

import * as OpenshiftToken from './hardcodedComponents/openshift/token';
import * as AwsSecret from './hardcodedComponents/aws/access_key';
import * as AwsArn from './hardcodedComponents/aws/arn';

import * as SWAwsArn from './hardcodedComponents/aws/subscriptionWatch';

import * as CMOpenshift from  './hardcodedComponents/openshift/costManagement';
import * as CMAzure from './hardcodedComponents/azure/costManagement';

import * as TowerCatalog from './hardcodedComponents/tower/catalog';
import * as Openshift from './hardcodedComponents/openshift/endpoint';

import { COST_MANAGEMENT_APP_NAME, CLOUD_METER_APP_NAME, CATALOG_APP } from '../api/constants';

const arnMessagePattern = <FormattedMessage id="wizard.arnPattern" defaultMessage="ARN must start with arn:aws:"/>;
const arnMessageLength = <FormattedMessage id="wizard.arnLength" defaultMessage="ARN should have at least 10 characters"/>;

const arnField = {
    placeholder: 'arn:aws:iam:123456789:role/CostManagement',
    isRequired: true,
    validate: [{
        type: validatorTypes.REQUIRED
    },  {
        type: validatorTypes.PATTERN,
        pattern: /^arn:aws:.*/,
        message: arnMessagePattern
    }, {
        type: validatorTypes.MIN_LENGTH,
        threshold: 10,
        message: arnMessageLength
    }]
};

const subsWatchArnField = {
    placeholder: 'arn:aws:iam:123456789:role/SubscriptionWatch',
    isRequired: true,
    validate: [{
        type: validatorTypes.REQUIRED
    }, {
        type: validatorTypes.PATTERN,
        pattern: /^arn:aws:.*/,
        message: arnMessagePattern
    }, {
        type: validatorTypes.MIN_LENGTH,
        threshold: 10,
        message: arnMessageLength
    }],
    label: <FormattedMessage id="wizard.arn" defaultMessage="ARN" />
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
                        label: <FormattedMessage id="wizard.clusterId" defaultMessage="Cluster Identifier"/>,
                        isRequired: true,
                        component: componentTypes.TEXT_FIELD,
                        validate: [{
                            type: validatorTypes.REQUIRED
                        }, {
                            type: validatorTypes.PATTERN,
                            pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/,
                            message: <FormattedMessage
                                id="wizard.clusterIdPattern"
                                defaultMessage="Cluster ID must start with alphanumeric character and can contain underscore and hyphen"
                            />
                        }]
                    },
                    additionalSteps: [{
                        title: <FormattedMessage id="cost.configureOperator" defaultMessage="Configure Cost Management Operator" />,
                        fields: [{
                            component: 'description',
                            name: 'description-summary',
                            Content: CMOpenshift.ConfigureCostOperator
                        }, {
                            name: 'source.source_ref'
                        }, {
                            component: componentTypes.TEXT_FIELD,
                            name: 'authentication.authtype',
                            hideField: true,
                            initialValue: 'token',
                            initializeOnMount: true
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
                    { type: validatorTypes.URL, message: <FormattedMessage id="wizard.urlPatternMessage" defaultMessage="The URL is not formatted correctly."/> }
                ]
            },
            'endpoint.certificate_authority': {
                label: <SSLFormLabel />,
                'aria-label': 'SSL Certificate'
            },
            additionalFields: [{
                component: 'description',
                name: 'description-summary',
                Content: Openshift.EndpointDesc
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
                            type: validatorTypes.PATTERN,
                            pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/,
                            message: <FormattedMessage
                                id="cost.subidPattern"
                                defaultMessage="Subscription ID must start with alphanumeric character and can contain underscore and hyphen"
                            />
                        }],
                        isRequired: true
                    },
                    'billing_source.data_source.resource_group': {
                        placeholder: '',
                        validate: [{
                            type: validatorTypes.REQUIRED
                        }, {
                            type: validatorTypes.PATTERN,
                            pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/,
                            message: <FormattedMessage
                                id="cost.resourceGroupPattern"
                                defaultMessage="Resource group must start with alphanumeric character and can contain underscore and hyphen"
                            />
                        }],
                        isRequired: true
                    },
                    'billing_source.data_source.storage_account': {
                        placeholder: '',
                        validate: [{
                            type: validatorTypes.REQUIRED
                        }, {
                            type: validatorTypes.PATTERN,
                            pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/,
                            message: <FormattedMessage
                                id="cost.storageAccountPattern"
                                defaultMessage="Storage account must start with alphanumeric character and can contain underscore and hyphen"
                            />
                        }],
                        isRequired: true
                    },
                    'authentication.password': {
                        isRequired: true,
                        type: 'password',
                        validate: [{
                            type: validatorTypes.REQUIRED
                        }],
                        label: <FormattedMessage id="cost.clientSecret" defaultMessage="Client secret"/>
                    },
                    'authentication.username': {
                        isRequired: true,
                        validate: [{
                            type: validatorTypes.REQUIRED
                        }],
                        label: <FormattedMessage id="cost.clientAppId" defaultMessage="Client (Application) ID" />
                    },
                    'authentication.extra.azure.tenant_id': {
                        isRequired: true,
                        label: <FormattedMessage id="cost.tenantDirId" defaultMessage="Tenant (Directory) ID" />,
                        validate: [{
                            type: validatorTypes.REQUIRED
                        }]
                    },
                    additionalSteps: [{
                        title: <FormattedMessage id="cost.azureSubStepId" defaultMessage="Configure resource group and storage account" />,
                        nextStep: 'azure-sub-id',
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
                            label: <FormattedMessage id="wizard.resourceGroupName" defaultMessage="Resource group name" />
                        }, {
                            name: 'billing_source.data_source.storage_account',
                            component: componentTypes.TEXT_FIELD,
                            label: <FormattedMessage id="wizard.storageAccountName" defaultMessage="Storage account name" />
                        }]
                    }, {
                        title: <FormattedMessage id="wizard.enterSubId" defaultMessage="Enter subscription ID" />,
                        name: 'azure-sub-id',
                        nextStep: 'configure-roles',
                        fields: [{
                            name: 'azure-sub-id-description',
                            component: 'description',
                            Content: CMAzure.SubscriptionID
                        }, {
                            name: 'credentials.subscription_id',
                            component: componentTypes.TEXT_FIELD,
                            label: <FormattedMessage id="wizard.subscriptionId" defaultMessage="Subscription ID" />
                        }]
                    }, {
                        title: <FormattedMessage id="wizard.configureRoles" defaultMessage="Configure roles" />,
                        name: 'configure-roles',
                        nextStep: 'export-schedule',
                        fields: [{
                            name: 'configure-service-principal',
                            component: 'description',
                            Content: CMAzure.ConfigureRolesDescription
                        }, {
                            name: 'authentication.extra.azure.tenant_id',
                            component: componentTypes.TEXT_FIELD
                        }, {
                            name: 'authentication.username',
                            component: componentTypes.TEXT_FIELD
                        }, {
                            name: 'authentication.password',
                            component: componentTypes.TEXT_FIELD
                        }, {
                            name: 'reader-role',
                            component: 'description',
                            Content: CMAzure.ReaderRoleDescription
                        }]
                    }, {
                        title: <FormattedMessage id="cost.createDailyExport" defaultMessage="Create daily export" />,
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
                        label: <FormattedMessage id="wizard.accessKeyId" defaultMessage="Access key ID" />,
                        placeholder: 'AKIAIOSFODNN7EXAMPLE',
                        isRequired: true,
                        validate: [{ type: validatorTypes.REQUIRED }]
                    },
                    'authentication.password': {
                        label: <FormattedMessage id="wizard.secretAccessKey" defaultMessage="Secret access key" />,
                        placeholder: 'wJairXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
                        isRequired: true,
                        validate: [{ type: validatorTypes.REQUIRED }],
                        type: 'password'
                    },
                    skipSelection: true,
                    onlyHiddenFields: true,
                    additionalSteps: [{
                        title: <FormattedMessage id="wizard.configureAccountAccess" defaultMessage="Configure account access" />,
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
                            type: validatorTypes.PATTERN,
                            pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/,
                            message: <FormattedMessage
                                id="cost.arn.s3BucketPattern"
                                defaultMessage="S3 bucket name must start with alphanumeric character and can contain underscore and hyphen"
                            />
                        }],
                        isRequired: true
                    },
                    additionalSteps: [{
                        title: <FormattedMessage id="cost.arn.usageDescriptionTitle" defaultMessage="Configure cost and usage reporting" />,
                        nextStep: 'tags',
                        fields: [{
                            name: 'usage-description',
                            component: 'description',
                            Content: AwsArn.UsageDescription
                        },  {
                            name: 'billing_source.bucket',
                            component: componentTypes.TEXT_FIELD,
                            label: <FormattedMessage id="cost.arn.s3Label" defaultMessage="S3 bucket name" />
                        }, {
                            component: componentTypes.TEXT_FIELD,
                            name: 'authentication.authtype',
                            hideField: true,
                            initialValue: 'arn',
                            initializeOnMount: true
                        }]
                    }, {
                        title: <FormattedMessage id="cost.arn.tagsStepTitle" defaultMessage="Activate cost allocation tags" />,
                        name: 'tags',
                        nextStep: 'iam-policy',
                        fields: [{
                            name: 'tags-description',
                            component: 'description',
                            Content: AwsArn.TagsDescription
                        }]
                    },
                    {
                        title: <FormattedMessage id="cost.arn.iamPolicyTitle" defaultMessage="Create IAM policy" />,
                        name: 'iam-policy',
                        nextStep: 'iam-role',
                        substepOf: { name: 'eaa', title: <FormattedMessage id="cost.arn.enableAccountAccess" defaultMessage="Enable account access" /> },
                        fields: [{
                            name: 'iam-policy-description',
                            component: 'description',
                            Content: AwsArn.IAMPolicyDescription
                        }]
                    }, {
                        title: <FormattedMessage id="cost.arn.iamRoleStepTitle" defaultMessage="Create IAM role" />,
                        name: 'iam-role',
                        nextStep: 'arn',
                        substepOf: 'eaa',
                        fields: [{
                            name: 'iam-role-description',
                            component: 'description',
                            Content: AwsArn.IAMRoleDescription
                        }]
                    }, {
                        title: <FormattedMessage id="cost.arn.enterArn" defaultMessage="Enter ARN" />,
                        name: 'arn',
                        substepOf: 'eaa',
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
                        title: <FormattedMessage id="cloudmeter.createIamPolicy" defaultMessage="Create IAM policy" />,
                        nextStep: 'subs-iam-role',
                        substepOf: { name: 'eaa', title: <FormattedMessage id="cloudmeter.enableAccountAccess" defaultMessage="Enable account access" /> },
                        fields: [{
                            name: 'iam-policy-description',
                            component: 'description',
                            Content: SWAwsArn.IAMPolicyDescription
                        }, {
                            component: componentTypes.TEXT_FIELD,
                            name: 'authentication.authtype',
                            hideField: true,
                            initialValue: 'cloud-meter-arn',
                            initializeOnMount: true
                        }]
                    }, {
                        title: <FormattedMessage id="cloudmeter.createIamRole" defaultMessage="Create IAM role" />,
                        name: 'subs-iam-role',
                        nextStep: 'subs-arn',
                        substepOf: 'eaa',
                        fields: [{
                            name: 'iam-role-description',
                            component: 'description',
                            Content: SWAwsArn.IAMRoleDescription
                        }]
                    }, {
                        title: <FormattedMessage id="cloudmeter.enterArn" defaultMessage="Enter ARN" />,
                        name: 'subs-arn',
                        substepOf: 'eaa',
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
                        label: <FormattedMessage id="satellite.satelliteId" defaultMessage="Satellite ID" />,
                        isRequired: true,
                        validate: [{ type: validatorTypes.REQUIRED }],
                        component: componentTypes.TEXT_FIELD
                    },
                    'endpoint.receptor_node': {
                        label: <FormattedMessage id="satellite.receptorId" defaultMessage="Receptor ID" />,
                        isRequired: true,
                        validate: [{ type: validatorTypes.REQUIRED }],
                        component: componentTypes.TEXT_FIELD
                    },
                    skipSelection: true,
                    onlyHiddenFields: true,
                    customSteps: true,
                    additionalSteps: [{
                        title: <FormattedMessage id="satellite.configureReceptorNode" defaultMessage="Configure receptor node credentials" />,
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
                            initialValue: 'satellite'
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
            receptor_node: {
                generic: {
                    skipEndpoint: true
                },
                [CATALOG_APP]: {
                    skipEndpoint: true
                }
            },
            username_password: {
                [CATALOG_APP]: {
                    skipSelection: true,
                    onlyHiddenFields: true,
                    customSteps: true,
                    'authentication.username': {
                        isRequired: false,
                        validate: [{ type: validatorTypes.REQUIRED }],
                        label: <FormattedMessage id="wizard.username" defaultMessage="Username" />
                    },
                    'authentication.password': {
                        type: 'password',
                        isRequired: false,
                        validate: [{ type: validatorTypes.REQUIRED }],
                        label: <FormattedMessage id="wizard.password" defaultMessage="Password" />
                    },
                    url: {
                        isRequired: true,
                        validate: [
                            { type: validatorTypes.REQUIRED },
                            {
                                type: validatorTypes.PATTERN,
                                message: <FormattedMessage id="catalog.urlPatternMessage" defaultMessage="URL must start with https:// or http://" />,
                                pattern: /^https{0,1}:\/\//
                            },
                            { type: validatorTypes.URL }
                        ],
                        helperText: <FormHelperText isHidden={false}>
                            <FormattedMessage
                                id="catalog.hostnameHelper"
                                defaultMessage="For example, https://myansibleinstance.example.com/ or https://127.0.0.1/"
                            />
                        </FormHelperText>,
                        label: <FormattedMessage id="wizard.hostname" defaultMessage="Hostname" />
                    },
                    'endpoint.certificate_authority': {
                        label: <FormattedMessage id="wizard.certificateAuthoriy" defaultMessage="Certificate authority" />
                    },
                    'endpoint.verify_ssl': {
                        initialValue: false,
                        label: <FormattedMessage id="wizard.verifySsl" defaultMessage="Verify SSL" />
                    },
                    additionalSteps: [{
                        nextStep: 'catalog-ansible-tower',
                        title: <FormattedMessage id="catalog.configureTowerCrendetials" defaultMessage="Configure Ansible Tower endpoint" />,
                        fields: [{
                            name: 'ansible-tower-desc',
                            component: 'description',
                            Content: TowerCatalog.EndpointDescription
                        }, {
                            name: 'endpoint.role',
                            component: componentTypes.TEXT_FIELD,
                            hideField: true,
                            initialValue: 'ansible',
                            initializeOnMount: true
                        }, {
                            name: 'url',
                            component: componentTypes.TEXT_FIELD
                        }, {
                            name: 'endpoint.verify_ssl',
                            component: componentTypes.SWITCH
                        }, {
                            name: 'endpoint.certificate_authority',
                            component: componentTypes.TEXT_FIELD,
                            condition: { is: true, when: 'endpoint.verify_ssl' }
                        }]
                    }, {
                        title: <FormattedMessage id="wizard.configureCredentialsNoTitle" defaultMessage="Configure credentials" />,
                        name: 'catalog-ansible-tower',
                        fields: [{
                            component: componentTypes.TEXT_FIELD,
                            name: 'authentication.authtype',
                            hideField: true,
                            initialValue: 'username_password',
                            initializeOnMount: true
                        }, {
                            name: 'required-desc',
                            component: 'description',
                            Content: TowerCatalog.AuthDescription
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
                placeholder: 'https://',
                label: <FormattedMessage id="wizard.hostname" defaultMessage="Hostname" />
            },
            'endpoint.certificate_authority': {
                label: <FormattedMessage id="wizard.certificateAuthority" defaultMessage="Certificate authority" />
            },
            'endpoint.verify_ssl': {
                initialValue: false
            }
        }
    }
};
