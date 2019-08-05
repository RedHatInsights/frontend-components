import React from 'react';
import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import zipObject from 'lodash/zipObject';
import { Popover, TextContent, TextList, TextListItem, Text, TextVariants, Title } from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons';
import SSLFormLabel from './SSLFormLabel';

const compileAllSourcesComboOptions = (sourceTypes) => (
    [
        { label: 'Choose a type' },
        ...sourceTypes.map(t => ({
            value: t.name,
            label: t.product_name
        }))
    ]
);

/* return hash of form: { amazon: 'amazon', google: 'google', openshift: 'openshift' } */
const compileStepMapper = (sourceTypes) => {
    const names = sourceTypes.map(t => t.name);
    return zipObject(names, names);
};

const firstStepNew = (sourceTypes) => ({
    title: 'Select a source type',
    name: 'step_1',
    stepKey: 1,
    nextStep: {
        when: 'source_type',
        stepMapper: compileStepMapper(sourceTypes)
    },
    fields: [
        {
            component: 'description',
            name: 'description-summary',
            content: <TextContent key='step1'>
                <Text component={ TextVariants.p }>
                To import data for an application, you need to connect to a data source.
                To begin, input a name and select the type of source you want to collect data from.
                </Text>
                <Text component={ TextVariants.p }>
            All fields are required.
                </Text>
            </TextContent>
        },
        {
            component: componentTypes.TEXT_FIELD,
            name: 'source_name',
            type: 'text',
            label: 'Name',
            helperText: 'For example, Source_1',
            isRequired: true,
            validate: [{
                type: validatorTypes.REQUIRED
            }]
        }, {
            component: componentTypes.SELECT_COMPONENT,
            name: 'source_type',
            label: 'Type',
            isRequired: true,
            options: compileAllSourcesComboOptions(sourceTypes),
            validate: [{
                type: validatorTypes.REQUIRED
            }]
        }]
});

const temporaryHardcodedSourceSchemas = {
    openshift: [
        {
            title: 'Add source credentials',
            fields: [{
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
            }, {
                component: componentTypes.TEXTAREA_FIELD,
                name: 'token',
                label: 'Token'
            }]
        }, {
            title: 'Enter OpenShift Container Platform information',
            fields: [{
                component: 'description',
                name: 'description-summary',
                content: <TextContent key='2'>
                    <Text component={ TextVariants.p }>
                    Provide OpenShift Container Platform URL and SSL certificate.
                    </Text>
                </TextContent>
            }, {
                component: componentTypes.TEXT_FIELD,
                name: 'role',
                type: 'hidden',
                initialValue: 'kubernetes' // value of 'role' for the endpoint
            }, {
                component: componentTypes.TEXT_FIELD,
                name: 'authtype',
                initialValue: 'token'
            }, {
                component: componentTypes.TEXT_FIELD,
                name: 'url',
                label: 'URL',
                helperText: 'For example, https://myopenshiftcluster.mycompany.com',
                isRequired: true,
                validate: [{ type: 'required-validator' }]
            }, {
                component: componentTypes.CHECKBOX,
                name: 'verify_ssl',
                label: 'Verify SSL'
            }, {
                component: componentTypes.TEXTAREA_FIELD,
                name: 'certificate_authority',
                label: <SSLFormLabel />,
                condition: {
                    when: 'verify_ssl',
                    is: true
                }
            }]
        }
    ],
    amazon: {
        title: 'Configure account access',
        fields: [{
            component: 'description',
            name: 'description-summary',
            content: <TextContent>
                <Text component={ TextVariants.p }>
                    <Title headingLevel="h3" size="2xl">Configure account access&nbsp;
                        <Popover
                            aria-label="Help text"
                            position="bottom"
                            maxWidth="50%"
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
        }, {
            component: componentTypes.TEXT_FIELD,
            name: 'role',
            type: 'hidden',
            initialValue: 'aws' // value of 'role' for the endpoint
        }, {
            component: componentTypes.TEXT_FIELD,
            name: 'authtype',
            initialValue: 'access_key_secret_key'
        }, {
            component: componentTypes.TEXT_FIELD,
            name: 'username',
            label: 'Access Key ID',
            helperText: 'For example, AKIAIOSFODNN7EXAMPLE',
            isRequired: true,
            validate: [{ type: 'required-validator' }]
        }, {
            component: componentTypes.TEXT_FIELD,
            name: 'password',
            label: 'Secret Key',
            type: 'password',
            helperText: 'For example, wJairXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
            isRequired: true,
            validate: [{ type: 'required-validator' }]
        }]
    },
    'mock-source': {
        title: 'Configure Mock Source',
        fields: [
            // Save to Endpoint
            {
                component: 'select-field',
                name: 'host',
                label: 'Config',
                validate: [{ type: 'required-validator' }],
                isRequired: true,
                initialValue: 'default',
                options: [
                    { label: 'Multi-threaded with events', value: 'default' },
                    { label: 'Single-threaded full refresh', value: 'simple' }
                ]
            },
            // Save to endpoint
            // FIXME: name => 'path'?
            {
                component: 'select-field',
                name: 'path',
                label: 'Amount',
                validate: [{ type: 'required-validator' }],
                isRequired: true,
                initialValue: 'default',
                options: [
                    { label: 'All collections | Small', value: 'small' },
                    { label: 'All collections | Medium', value: 'default' },
                    { label: 'All collections | Large', value: 'large' },
                    { label: 'Amazon | Small', value: 'amazon/small' },
                    { label: 'Amazon | Medium', value: 'amazon/default' },
                    { label: 'Amazon | Large', value: 'amazon/large' },
                    { label: 'Openshift | Small', value: 'openshift/small' },
                    { label: 'Openshift | Medium', value: 'openshift/default' },
                    { label: 'Openshift | Large', value: 'openshift/large' }
                ]
            }
        ]
    }
};

/* Switch between using hard-coded provider schemas and schemas from the api/source_types */
const sourceTypeSchemaHardcodedWithFallback = t => (temporaryHardcodedSourceSchemas[t.name] || t.schema);
const sourceTypeSchemaWithFallback = t => (t.schema || temporaryHardcodedSourceSchemas[t.name]);
const sourceTypeSchemaHardcoded = t => temporaryHardcodedSourceSchemas[t.name];
const sourceTypeSchemaServer = t => t.schema;

const schemaMode = 4; // defaults to 0

const sourceTypeSchema = {
    0: sourceTypeSchemaWithFallback,
    1: sourceTypeSchemaHardcoded,
    2: sourceTypeSchemaServer,
    4: sourceTypeSchemaHardcodedWithFallback
}[schemaMode];

const fieldsToStep = (fields, stepName, nextStep) => ({
    ...fields, // expected to include title and fields
    name: stepName,
    stepKey: stepName,
    nextStep
});

const indexedStepName = (base, index) => index === 0 ? base : `${base}_${index}`;

const fieldsToSteps = (fields, stepNamePrefix, lastStep) =>
    Array.isArray(fields) ?
        fields.map((page, index) =>
            fieldsToSteps(
                page,
                indexedStepName(stepNamePrefix, index),
                index < fields.length - 1 ? indexedStepName(stepNamePrefix, index + 1) : lastStep)
        ) : fieldsToStep(fields, stepNamePrefix, lastStep);

const sourceTypeSteps = sourceTypes =>
    sourceTypes.map(t => fieldsToSteps(sourceTypeSchema(t), t.name, 'summary'))
    .flatMap((x) => x);

const summaryStep = (sourceTypes) => ({
    fields: [
        {
            component: 'description',
            name: 'description-summary',
            content: <TextContent>
                <Title headingLevel="h3" size="2xl">Review source details</Title>
                <Text component={ TextVariants.p }>
            Review the information below and click Finish to configure your project. Use the Back button to make changes.
                </Text>
            </TextContent>
        },
        {
            name: 'summary',
            component: 'summary',
            sourceTypes
        }],
    stepKey: 'summary',
    name: 'summary',
    title: 'Review source details'
});

export default (sourceTypes) => (
    { fields: [
        {
            component: componentTypes.WIZARD,
            name: 'wizard',
            title: 'Add a source',
            inModal: true,
            description: 'You are importing data into this platform',
            buttonLabels: {
                submit: 'Finish'
            },
            fields: [
                firstStepNew(sourceTypes),
                ...sourceTypeSteps(sourceTypes),
                summaryStep(sourceTypes)
            ]
        }
    ]});
