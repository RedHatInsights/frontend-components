import React from 'react';
import { validatorTypes } from '@data-driven-forms/react-form-renderer';
import { Popover, TextContent, TextList, TextListItem, Text, TextVariants, Title } from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons';
import SSLFormLabel from './SSLFormLabel';

export default {
    openshift: {
        authentication: {
            token: {
                additionalFields: [{
                    component: 'description',
                    name: 'description-summary',
                    content: <TextContent key='1'>
                        <Text component={ TextVariants.p }>
                                Add credentials that enable communication with this source.
                                    This source requires the login token.
                        </Text>
                        <Text component={ TextVariants.p }>
                                To collect data from a Red Hat OpenShift Container Platform source,
                        </Text>
                        <TextContent>
                            <TextList component='ul'>
                                <TextListItem component='li' key='1'>
                                        Log in to the Red Hat OpenShift Container Platform cluster with an account
                                            that has access to the namespace
                                </TextListItem>
                                <TextListItem component='li' key='2'>
                                        Run the following command to obtain your login token:
                                    <b>&nbsp;# oc sa get-token -n management-infra management-admin</b>
                                </TextListItem>
                                <TextListItem component='li' key='3'>
                                        Copy the token and paste it in the following field.
                                </TextListItem>
                            </TextList>
                        </TextContent>
                    </TextContent>
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
                        content: <TextContent>
                            <Text component={ TextVariants.p }>
                                <Title headingLevel="h3" size="lg">Configure account access&nbsp;
                                    <Popover
                                        aria-label="Help text"
                                        position="bottom"
                                        bodyContent={
                                            <React.Fragment>
                                                <Text component={ TextVariants.p }>
                                        Red Had recommends using the Power User AWS
                                                            Identity and Access Management (IAM) policy when adding an
                                                            AWS account as a source. This Policy allows the user full
                                                            access to API functionality and AWS services for user
                                                            administration.
                                                    <br />
                                        Create an access key in the
                                        &nbsp;<b>
                                            Security Credentials
                                                    </b>&nbsp;
                                        area of your AWS user account. To add your
                                                            account as a source, enter the access key ID and secret
                                                            access key to act as your user ID and password.
                                                </Text>
                                            </React.Fragment>
                                        }
                                        footerContent={ <a href='http://foo.bar'>
                                Learn more
                                        </a> }
                                    >
                                        <QuestionCircleIcon />
                                    </Popover>
                                </Title>
                            </Text>
                            <Text component={ TextVariants.p }>
                            Create an access key in your AWS user account and enter the details below.
                            </Text>
                            <Text component={ TextVariants.p }>
                            For sufficient access and security, Red Hat recommends using
                                the Power User IAM polocy for your AWS user account.
                            </Text>
                            <Text component={ TextVariants.p }>
                            All fields are required.
                            </Text>
                        </TextContent>
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
        endpoint: {}
    }
};
