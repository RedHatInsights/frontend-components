import React from 'react';
import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import debouncePromise from '../utilities/debouncePromise';
import { findSource } from '../api';
import { schemaBuilder } from './schemaBuilder';
import { WIZARD_DESCRIPTION, WIZARD_TITLE } from '../utilities/stringConstants';

export const asyncValidator = (value, sourceId = undefined) => findSource(value).then(({ data: { sources } }) => {
    if (sources.find(({ id }) => id !== sourceId)) {
        return 'Name has already been taken';
    }

    if (value === '' || value === undefined) {
        return 'Required';
    }

    return undefined;
});

let firstValidation = true;
export const setFirstValidated = (bool) => firstValidation = bool;
export const getFirstValidated = () => firstValidation;

export const asyncValidatorDebounced = debouncePromise(asyncValidator);

export const asyncValidatorDebouncedWrapper = () => {
    if (getFirstValidated()) {
        setFirstValidated(false);
        return (value, id) => value ? asyncValidator(value, id) : 'Required';
    }

    return asyncValidatorDebounced;
};

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

export const iconMapper = sourceTypes => (name, DefaultIcon) => {
    const sourceType = sourceTypes.find((type) => type.name === name);

    if (!sourceType || !sourceType.icon_url) {
        return DefaultIcon;
    }

    const Icon = () => <img src={sourceType.icon_url} alt={sourceType.product_name} className="ins-c-sources__wizard--icon" />;

    return Icon;
};

export const nextStep = ({ values: { application, source_type } }) => {
    const appId = application && application.application_type_id;
    const resultedStep = appId ? `${source_type}-${appId}` : source_type;

    return resultedStep;
};

const typesStep = (sourceTypes, applicationTypes, disableAppSelection) => ({
    title: 'Choose application and source type',
    name: 'types_step',
    stepKey: 'types_step',
    nextStep,
    fields: [
        {
            component: 'card-select',
            name: 'application.application_type_id',
            label: 'Select your application (optional)',
            // eslint-disable-next-line react/display-name
            DefaultIcon: null,
            options: compileAllApplicationComboOptions(applicationTypes),
            mutator: appMutator(applicationTypes),
            helperText: 'Selecting an application will limit the available source types. You can assign an application to your source now, or after adding your source.',
            isDisabled: disableAppSelection
        },
        {
            component: 'card-select',
            name: 'source_type',
            isRequired: true,
            label: 'Select your source type',
            iconMapper: iconMapper(sourceTypes),
            validate: [{
                type: validatorTypes.REQUIRED
            }],
            options: compileAllSourcesComboOptions(sourceTypes),
            mutator: sourceTypeMutator(applicationTypes, sourceTypes)
        }
    ]
});

const nameStep = () => ({
    title: 'Enter source name',
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
                Enter a name, then proceed to select your application and source type.
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
                (value) => asyncValidatorDebouncedWrapper()(value)
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
    title: 'Review details'
});

export default (sourceTypes, applicationTypes, disableAppSelection) => {
    setFirstValidated(true);

    return ({
        fields: [{
            component: componentTypes.WIZARD,
            name: 'wizard',
            title: WIZARD_TITLE,
            inModal: true,
            description: WIZARD_DESCRIPTION,
            buttonLabels: {
                submit: 'Add'
            },
            showTitles: true,
            predictSteps: true,
            crossroads: [ 'application.application_type_id', 'source_type', 'auth_select' ],
            fields: [
                nameStep(),
                typesStep(sourceTypes, applicationTypes, disableAppSelection),
                ...schemaBuilder(sourceTypes, applicationTypes),
                summaryStep(sourceTypes, applicationTypes)
            ]
        }]
    });
};
