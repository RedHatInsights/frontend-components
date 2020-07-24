import React from 'react';
import { useIntl } from 'react-intl';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import debouncePromise from '../utilities/debouncePromise';
import { findSource } from '../api';
import { schemaBuilder } from './schemaBuilder';
import { WIZARD_DESCRIPTION, WIZARD_TITLE } from '../utilities/stringConstants';
import ValidatorReset from './ValidatorReset';
import { handleError } from '../api/handleError';
import validated from '../sourceFormRenderer/resolveProps/validated';

export const asyncValidator = async (value, sourceId = undefined, intl) => {
    if (!value) {
        return undefined;
    }

    let response;
    try {
        response = await findSource(value);
    } catch (error) {
        console.error(handleError(error));
        return undefined;
    }

    if (response.data.sources.find(({ id }) => id !== sourceId)) {
        throw intl.formatMessage({ defaultMessage: 'That name is taken. Try another.', id: 'wizard.nameTaken' });
    }

    return undefined;
};

let firstValidation = true;
export const setFirstValidated = (bool) => firstValidation = bool;
export const getFirstValidated = () => firstValidation;

export const asyncValidatorDebounced = debouncePromise(asyncValidator);

export const asyncValidatorDebouncedWrapper = (intl) => {
    if (getFirstValidated()) {
        setFirstValidated(false);
        return (value, id) => value ? asyncValidator(value, id, intl) : undefined;
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

const compileAllApplicationComboOptions = (applicationTypes, intl) => (
    [
        {
            label: intl.formatMessage({
                id: 'wizard.none',
                defaultMessage: 'None'
            }),
            key: 'none'
        },
        ...applicationTypes.sort((a, b) => a.display_name.localeCompare(b.display_name)).map(t => ({
            value: t.id,
            label: t.display_name
        }))
    ]
);

export const appMutator = (appTypes) => (option, formOptions) => {
    if (!option.value) {
        return option;
    }

    const selectedSourceType = formOptions.getState().values.source_type;
    const appType = appTypes.find(app => app.display_name === option.label);
    const isEnabled = selectedSourceType ? appType.supported_source_types.includes(selectedSourceType) : true;
    return {
        ...option,
        isDisabled: !isEnabled
    };
};

export const sourceTypeMutator = (appTypes, sourceTypes) => (option, formOptions) => {
    const selectedApp = formOptions.getState().values.application ? formOptions.getState().values.application.application_type_id : undefined;
    const appType = appTypes.find(app => app.id === selectedApp);
    const isEnabled = appType ? appType.supported_source_types.includes(sourceTypes.find(type => type.product_name === option.label).name) : true;
    return {
        ...option,
        isDisabled: !isEnabled
    };
};

export const iconMapper = sourceTypes => (name) => {
    const sourceType = sourceTypes.find((type) => type.name === name);

    if (!sourceType || !sourceType.icon_url) {
        return null;
    }

    const Icon = () => <img src={sourceType.icon_url} alt={sourceType.product_name} className="ins-c-sources__wizard--icon" />;

    return Icon;
};

export const nextStep = ({ values: { application, source_type } }) => {
    const appId = application && application.application_type_id;
    const resultedStep = appId ? `${source_type}-${appId}` : source_type;

    return resultedStep;
};

const typesStep = (sourceTypes, applicationTypes, disableAppSelection, intl) => ({
    title: intl.formatMessage({
        id: 'wizard.chooseAppAndType',
        defaultMessage: 'Choose application and source type'
    }),
    name: 'types_step',
    nextStep,
    fields: [
        {
            component: 'enhanced-select',
            name: 'application.application_type_id',
            label: intl.formatMessage({
                id: 'wizard.selectYourApplication',
                defaultMessage: 'A. Select your application'
            }),
            // eslint-disable-next-line react/display-name
            options: compileAllApplicationComboOptions(applicationTypes, intl),
            mutator: appMutator(applicationTypes),
            description: intl.formatMessage({
                id: 'wizard.selectAppWarning',
                defaultMessage: 'Selecting an application will limit the available source types. You can assign an application to your source now or after adding your source.'
            }),
            isDisabled: disableAppSelection,
            placeholder: intl.formatMessage({ id: 'wizard.chooseApp', defaultMessage: 'Choose application' })
        },
        {
            component: 'card-select',
            name: 'source_type',
            isRequired: true,
            label: intl.formatMessage({
                id: 'wizard.selectYourSourceType',
                defaultMessage: 'B. Select your source type'
            }),
            iconMapper: iconMapper(sourceTypes),
            validate: [{
                type: validatorTypes.REQUIRED
            }],
            options: compileAllSourcesComboOptions(sourceTypes),
            mutator: sourceTypeMutator(applicationTypes, sourceTypes)
        },
        {
            component: 'description',
            name: 'fixasyncvalidation',
            Content: ValidatorReset
        }
    ]
});

export const NameDescription = () => {
    const intl = useIntl();

    return (
        <TextContent key='step1'>
            <Text component={ TextVariants.p }>
                { intl.formatMessage({
                    id: 'wizard.nameDescription',
                    // eslint-disable-next-line max-len
                    defaultMessage: 'To import data for an application, you need to connect to a data source. Enter a name, then proceed to select your application and source type.'
                }) }
            </Text>
        </TextContent>
    );
};

const nameStep = (intl) => ({
    title: intl.formatMessage({
        id: 'wizard.enterSourceName',
        defaultMessage: 'Enter source name'
    }),
    name: 'name_step',
    nextStep: 'types_step',
    fields: [
        {
            component: 'description',
            name: 'description-summary',
            Content: NameDescription
        },
        {
            component: componentTypes.TEXT_FIELD,
            name: 'source.name',
            type: 'text',
            label: intl.formatMessage({
                id: 'wizard.name',
                defaultMessage: 'Name'
            }),
            placeholder: 'Source_1',
            isRequired: true,
            validate: [
                (value) => asyncValidatorDebouncedWrapper(intl)(value, undefined, intl),
                { type: validatorTypes.REQUIRED }
            ],
            resolveProps: validated
        }
    ]
});

export const SummaryDescription = () => {
    const intl = useIntl();

    return (
        <TextContent>
            <Text component={ TextVariants.p }>
                { intl.formatMessage({
                    id: 'wizard.summaryDescription',
                    defaultMessage: 'Review the information below and click Add to add your source. Use the Back button to make changes.'
                }) }
            </Text>
        </TextContent>
    );
};

const summaryStep = (sourceTypes, applicationTypes, intl) => ({
    fields: [
        {
            component: 'description',
            name: 'description-summary',
            Content: SummaryDescription
        },
        {
            name: 'summary',
            component: 'summary',
            sourceTypes,
            applicationTypes
        }],
    name: 'summary',
    title: intl.formatMessage({
        id: 'wizard.reviewDetails',
        defaultMessage: 'Review details'
    })
});

export default (sourceTypes, applicationTypes, disableAppSelection, container, intl) => {
    setFirstValidated(true);

    return ({
        fields: [{
            component: componentTypes.WIZARD,
            name: 'wizard',
            title: WIZARD_TITLE,
            inModal: true,
            description: WIZARD_DESCRIPTION,
            buttonLabels: {
                submit: intl.formatMessage({
                    id: 'sources.add',
                    defaultMessage: 'Add'
                }),
                back: intl.formatMessage({
                    id: 'wizard.back',
                    defaultMessage: 'Back'
                }),
                cancel: intl.formatMessage({
                    id: 'wizard.cancel',
                    defaultMessage: 'Cancel'
                }),
                next: intl.formatMessage({
                    id: 'wizard.next',
                    defaultMessage: 'Next'
                })
            },
            container,
            showTitles: true,
            crossroads: [ 'application.application_type_id', 'source_type', 'auth_select' ],
            fields: [
                nameStep(intl),
                typesStep(sourceTypes, applicationTypes, disableAppSelection, intl),
                ...schemaBuilder(sourceTypes, applicationTypes),
                summaryStep(sourceTypes, applicationTypes, intl)
            ]
        }]
    });
};
