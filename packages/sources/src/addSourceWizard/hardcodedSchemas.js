import React from 'react';
import { validatorTypes } from '@data-driven-forms/react-form-renderer';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import SSLFormLabel from './SSLFormLabel';

import * as OpenshiftToken from './hardcodedComponents/openshift/token';
import * as AwsSecret from './hardcodedComponents/aws/access_key';
import * as AwsArn from './hardcodedComponents/aws/arn';

export default {
    openshift: {
        authentication: {
            token: {
                additionalFields: [{
                    component: 'description',
                    name: 'description-summary',
                    content: <OpenshiftToken.DescriptionSummary />
                }]
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
                content: <TextContent key='2'>
                    <Text component={ TextVariants.p }>
                    Provide OpenShift Container Platform URL and SSL certificate.
                    </Text>
                </TextContent>
            }]
        }
    },
    amazon: {
        authentication: {
            access_key_secret_key: {
                additionalFields: [
                    {
                        component: 'description',
                        name: 'description-summary',
                        content: <AwsSecret.DescriptionSummary />
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
            },
            arn: {
                'authentication.arn': {
                    placeholder: 'arn:aws:iam:123456789:role/CostManagement'
                },
                'arn-description': {
                    content: <AwsArn.ArnDescription />
                },
                'iam-role-description': {
                    content: <AwsArn.IAMRoleDescription />
                },
                'iam-role-description-2': {
                    content: <AwsArn.IAMRoleDescriptionSecond />
                },
                'iam-policy-description': {
                    content: <AwsArn.IAMPolicyDescription />
                },
                'iam-policy-description-2': {
                    content: <AwsArn.IAMPolicyDescriptionSecond />
                },
                'tags-description': {
                    content: <AwsArn.TagsDescription />
                },
                'usage-description': {
                    content: <AwsArn.UsageDescription />
                },
                'cost_management.s3_bucket': {
                    placeholder: 'cost-usage-bucket'
                }
            }
        },
        endpoint: {}
    }
};
