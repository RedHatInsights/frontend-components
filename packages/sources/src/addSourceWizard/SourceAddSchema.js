import React from 'react';
import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import { Popover, TextContent, TextList, TextListItem, Text, TextVariants, Title } from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons';
import SSLFormLabel from './SSLFormLabel';
import { AwsIcon, OpenshiftIcon, MicrosoftIcon } from '@patternfly/react-icons';
import debouncePromise from '../utilities/debouncePromise';
import { findSource } from '../api';

export const asyncValidator = (value, sourceId = undefined) => findSource(value).then(({ data: { sources } }) => {
    if (sources.find(({ id }) => id !== sourceId)) {
        return 'Name has already been taken';
    }

    if (value === '' || value === undefined) {
        return 'Name can\'t be blank';
    }

    return undefined;
});

const asyncValidatorDebounced = debouncePromise(asyncValidator);

const compileAllSourcesComboOptions = (sourceTypes) => (
    [
        ...sourceTypes.sort((a, b) => a.product_name.localeCompare(b.product_name)).map(t => ({
            value: t.name,
            label: t.product_name
        }))
    ]
);

const compileAllApplicationComboOptions = (applicationTypes) => (
    [
        ...applicationTypes.sort((a, b) => a.display_name.localeCompare(b.display_name)).map(t => ({
            value: t.id,
            label: t.display_name
        }))
    ]
);

const appMutator = (appTypes) => (option, formOptions) => {
    const selectedSourceType = formOptions.getState().values.source_type;
    const appType = appTypes.find(app => app.display_name === option.label);
    const isEnabled = selectedSourceType ? appType.supported_source_types.includes(selectedSourceType) : true;
    return {
        ...option,
        isDisabled: !isEnabled
    };
};

const sourceTypeMutator = (appTypes, sourceTypes) => (option, formOptions) => {
    const selectedApp = formOptions.getState().values.application ? formOptions.getState().values.application.application_type_id : undefined;
    const appType = appTypes.find(app => app.id === selectedApp);
    const isEnabled = appType ? appType.supported_source_types.includes(sourceTypes.find(type => type.product_name === option.label).name) : true;
    return {
        ...option,
        isDisabled: !isEnabled
    };
};

/* return hash of form: { amazon: 'amazon', google: 'google', openshift: 'openshift' } */
const compileStepMapper = (sourceTypes) => sourceTypes.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.name }), {});

const iconMapper = (name, DefaultIcon) => ({
    openshift: OpenshiftIcon,
    amazon: AwsIcon,
    azure: MicrosoftIcon
}[name] || DefaultIcon);

const typesStep = (sourceTypes, applicationTypes, disableAppSelection) => ({
    title: 'Configure your source',
    name: 'types_step',
    stepKey: 'types_step',
    nextStep: {
        when: 'source_type',
        stepMapper: compileStepMapper(sourceTypes)
    },
    fields: [
        {
            component: 'card-select',
            name: 'application.application_type_id',
            label: 'Select your application',
            // eslint-disable-next-line react/display-name
            DefaultIcon: () => <React.Fragment />,
            options: compileAllApplicationComboOptions(applicationTypes),
            mutator: appMutator(applicationTypes),
            helperText: 'Selected application will limit the options of available source types. You can assign an application to your source later.',
            isDisabled: disableAppSelection
        },
        {
            component: 'card-select',
            name: 'source_type',
            isRequired: true,
            label: 'Select your source type',
            iconMapper,
            validate: [{
                type: validatorTypes.REQUIRED
            }],
            options: compileAllSourcesComboOptions(sourceTypes),
            mutator: sourceTypeMutator(applicationTypes, sourceTypes)
        }
    ]
});

const nameStep = () => ({
    title: 'Select source name',
    name: 'name_step',
    stepKey: 1,
    nextStep: 'types_step',
    fields: [
        {
            component: 'description',
            name: 'description-summary',
            content: <TextContent key='step1'>
                <Text component={ TextVariants.p }>
                To import data for an application, you need to connect to a data source.
                Input a name and then proceed to the selection of application and source types.
                </Text>
                <Text component={ TextVariants.p }>
            Name is required and has to be unique.
                </Text>
            </TextContent>
        },
        {
            component: componentTypes.TEXT_FIELD,
            name: 'source.name',
            type: 'text',
            label: 'Name',
            placeholder: 'Source_1',
            isRequired: true,
            validate: [
                (value) => asyncValidatorDebounced(value)
            ]
        }
    ]
});

export const temporaryHardcodedSourceSchemas = {
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
                name: 'authentication.password',
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
                name: 'url',
                label: 'URL',
                placeholder: 'https://myopenshiftcluster.mycompany.com',
                isRequired: true,
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.URL }
                ]
            }, {
                component: componentTypes.CHECKBOX,
                name: 'endpoint.verify_ssl',
                label: 'Verify SSL'
            }, {
                component: componentTypes.TEXTAREA_FIELD,
                name: 'endpoint.certificate_authority',
                label: <SSLFormLabel />,
                condition: {
                    when: 'endpoint.verify_ssl',
                    is: true
                }
            }, {
                component: componentTypes.TEXT_FIELD,
                name: 'endpoint.role',
                type: 'hidden',
                initialValue: 'kubernetes' // value of 'role' for the endpoint
            }, {
                component: componentTypes.TEXT_FIELD,
                name: 'authentication.authtype',
                initialValue: 'token',
                type: 'hidden'
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
            name: 'authentication.username',
            label: 'Access Key ID',
            placeholder: 'AKIAIOSFODNN7EXAMPLE',
            isRequired: true,
            validate: [{ type: validatorTypes.REQUIRED }]
        }, {
            component: componentTypes.TEXT_FIELD,
            name: 'authentication.password',
            label: 'Secret Key',
            type: 'password',
            placeholder: 'wJairXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
            isRequired: true,
            validate: [{ type: validatorTypes.REQUIRED }]
        }, {
            component: componentTypes.TEXT_FIELD,
            name: 'endpoint.role',
            type: 'hidden',
            initialValue: 'aws' // value of 'role' for the endpoint
        }, {
            component: componentTypes.TEXT_FIELD,
            name: 'authentication.authtype',
            initialValue: 'access_key_secret_key',
            type: 'hidden'
        }]
    }
};

/* Switch between using hard-coded provider schemas and schemas from the api/source_types */
const sourceTypeSchemaHardcodedWithFallback = t => (
    temporaryHardcodedSourceSchemas[t.name] ||
    { ...t.schema, fields: t.schema.fields.sort((_a, b) => b.type === 'hidden' ? -1 : 0) }
);
const sourceTypeSchemaWithFallback = t => (t.schema || temporaryHardcodedSourceSchemas[t.name]);
const sourceTypeSchemaHardcoded = t => temporaryHardcodedSourceSchemas[t.name];
const sourceTypeSchemaServer = t => ({ ...t.schema, fields: t.schema.fields.sort((_a, b) => b.type === 'hidden' ? -1 : 0) });

const sourceTypeSchema = (schemaMode = 4) => ({
    0: sourceTypeSchemaWithFallback,
    1: sourceTypeSchemaHardcoded,
    2: sourceTypeSchemaServer,
    4: sourceTypeSchemaHardcodedWithFallback
}[schemaMode]);

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

const sourceTypeSteps = (sourceTypes, disableHardcodedSchemas) =>
    sourceTypes.map(t => fieldsToSteps(sourceTypeSchema(disableHardcodedSchemas ? 2 : 4)(t), t.name, 'summary'))
    .flatMap((x) => x);

const summaryStep = (sourceTypes, applicationTypes) => ({
    fields: [
        {
            component: 'description',
            name: 'description-summary',
            content: <TextContent>
                <Title headingLevel="h3" size="2xl">Review source details</Title>
                <Text component={ TextVariants.p }>
            Review the information below and click Finish to add your source. Use the Back button to make changes.
                </Text>
            </TextContent>
        },
        {
            name: 'summary',
            component: 'summary',
            sourceTypes,
            applicationTypes
        }],
    stepKey: 'summary',
    name: 'summary',
    title: 'Review source details'
});

export default (sourceTypes, applicationTypes, disableAppSelection, disableHardcodedSchemas) => (
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
                nameStep(),
                typesStep(sourceTypes, applicationTypes, disableAppSelection),
                ...sourceTypeSteps(sourceTypes, disableHardcodedSchemas),
                summaryStep(sourceTypes, applicationTypes)
            ]
        }
    ] });
