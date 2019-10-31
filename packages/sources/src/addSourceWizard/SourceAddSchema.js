import React from 'react';
import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import { AwsIcon, OpenshiftIcon, MicrosoftIcon } from '@patternfly/react-icons';
import debouncePromise from '../utilities/debouncePromise';
import { findSource } from '../api';
import { schemaBuilder } from './schemaBuilder';
import hardcodedSchemas from './hardcodedSchemas';

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

const iconMapper = (name, DefaultIcon) => ({
    openshift: OpenshiftIcon,
    amazon: AwsIcon,
    azure: MicrosoftIcon
}[name] || DefaultIcon);

export const nextStep = ({ values: { application, source_type } }, applicationTypes) => {
    const appId = application && application.application_type_id;
    const app = appId && applicationTypes.find(({ id }) => id === appId);

    let hasSpecificSteps = false;

    if (app && hardcodedSchemas[source_type] && hardcodedSchemas[source_type].authentication) {
        const schema = hardcodedSchemas[source_type].authentication;
        hasSpecificSteps = Object.keys(schema).some((key) => schema[key].hasOwnProperty(app.name));
    }

    const resultedStep = appId && hasSpecificSteps ? `${source_type}-${appId}` : source_type;

    console.log(resultedStep);
    return resultedStep;
};

const typesStep = (sourceTypes, applicationTypes, disableAppSelection) => ({
    title: 'Configure your source',
    name: 'types_step',
    stepKey: 'types_step',
    nextStep: (args) => nextStep(args, applicationTypes),
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
            // eslint-disable-next-line react/display-name
            Content: () => (<TextContent key='step1'>
                <Text component={ TextVariants.p }>
                To import data for an application, you need to connect to a data source.
                Input a name and then proceed to the selection of application and source types.
                </Text>
                <Text component={ TextVariants.p }>
            Name is required and has to be unique.
                </Text>
            </TextContent>)
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

const summaryStep = (sourceTypes, applicationTypes) => ({
    fields: [
        {
            component: 'description',
            name: 'description-summary',
            // eslint-disable-next-line react/display-name
            Content: () => (<TextContent>
                <Text component={ TextVariants.p }>
            Review the information below and click Finish to add your source. Use the Back button to make changes.
                </Text>
            </TextContent>)
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

export default (sourceTypes, applicationTypes, disableAppSelection) => (
    { fields: [
        {
            component: componentTypes.WIZARD,
            name: 'wizard',
            title: 'Add a source',
            inModal: true,
            description: 'Connect an external source to Red Hat Cloud Services',
            buttonLabels: {
                submit: 'Finish'
            },
            showTitles: true,
            predictSteps: true,
            fields: [
                nameStep(),
                typesStep(sourceTypes, applicationTypes, disableAppSelection),
                ...schemaBuilder(sourceTypes, applicationTypes),
                summaryStep(sourceTypes, applicationTypes)
            ]
        }
    ] }
);
