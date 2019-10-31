import React from 'react';
import { validatorTypes } from '@data-driven-forms/react-form-renderer';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import SSLFormLabel from './SSLFormLabel';

import * as OpenshiftToken from './hardcodedComponents/openshift/token';
import * as AwsSecret from './hardcodedComponents/aws/access_key';
import * as AwsArn from './hardcodedComponents/aws/arn';

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
                    additionalFields: [{
                        component: 'description',
                        name: 'description-summary',
                        Content: OpenshiftToken.DescriptionSummary
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
                    { type: validatorTypes.URL }
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
                    Provide OpenShift Container Platform URL and SSL certificate.
                    </Text>
                </TextContent>)
            }]
        }
    },
    amazon: {
        authentication: {
            access_key_secret_key: {
                generic: {
                    additionalFields: [
                        {
                            component: 'description',
                            name: 'description-summary',
                            Content: AwsSecret.DescriptionSummary
                        }
                    ],
                    'authentication.username': {
                        placeholder: 'AKIAIOSFODNN7EXAMPLE',
                        isRequired: true,
                        validate: [{ type: validatorTypes.REQUIRED }]
                    },
                    'authentication.password': {
                        placeholder: 'wJairXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
                        isRequired: true,
                        validate: [{ type: validatorTypes.REQUIRED }]
                    }
                }
            },
            arn: {
                generic: {
                    includeStepKeyFields: [ 'arn' ],
                    'authentication.password': arnField
                },
                '/insights/platform/cost-management': {
                    'authentication.password': arnField,
                    'arn-description': {
                        Content: AwsArn.ArnDescription
                    },
                    'iam-role-description': {
                        Content: AwsArn.IAMRoleDescription
                    },
                    'iam-policy-description': {
                        Content: AwsArn.IAMPolicyDescription,
                        assignFormOptions: true
                    },
                    'tags-description': {
                        Content: AwsArn.TagsDescription
                    },
                    'usage-description': {
                        Content: AwsArn.UsageDescription
                    },
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
                        nextStep: 'iam-policy',
                        fields: [{
                            name: 'usage-description',
                            component: 'description'
                        }]
                    }, {
                        title: 'Activate tags',
                        stepKey: 'tags',
                        nextStep: 'iam-policy',
                        fields: [{
                            name: 'tags-description',
                            component: 'description'
                        }]
                    },
                    {
                        title: 'Create IAM policy',
                        stepKey: 'iam-policy',
                        nextStep: 'iam-role',
                        substepOf: 'Enable account access',
                        fields: [{
                            name: 'iam-policy-description',
                            component: 'description'
                        }]
                    }, {
                        title: 'Create IAM role',
                        stepKey: 'iam-role',
                        nextStep: 'arn',
                        substepOf: 'Enable account access',
                        fields: [{
                            name: 'iam-role-description',
                            component: 'description'
                        }]
                    }, {
                        title: 'Enter ARN',
                        stepKey: 'arn',
                        substepOf: 'Enable account access',
                        fields: [{
                            name: 'arn-description',
                            component: 'description'
                        }]
                    }]
                }
            }
        },
        endpoint: {}
    }
};
