import React from 'react';
import { FormattedMessage } from 'react-intl';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import hardcodedSchemas from './hardcodedSchemas';
import get from 'lodash/get';

export const acronymMapper = (value) => ({
    'Amazon Web Services': 'AWS'
}[value] || value);

export const hardcodedSchema = (typeName, authName, appName) =>
    get(hardcodedSchemas, [ typeName, 'authentication', authName, appName ], undefined);

export const getAdditionalSteps = (typeName, authName, appName = 'generic') =>
    get(hardcodedSchemas, [ typeName, 'authentication', authName, appName, 'additionalSteps' ], []);

export const shouldSkipSelection = (typeName, authName, appName = 'generic') =>
    get(hardcodedSchemas, [ typeName, 'authentication', authName, appName, 'skipSelection' ], false);

export const shouldSkipEndpoint = (typeName, authName, appName = 'generic') =>
    get(hardcodedSchemas, [ typeName, 'authentication', authName, appName, 'skipEndpoint' ], false);

export const hasCustomSteps = (typeName, authName, appName = 'generic') =>
    get(hardcodedSchemas, [ typeName, 'authentication', authName, appName, 'customSteps' ], false);

export const getAdditionalStepKeys = (typeName, authName, appName = 'generic') =>
    get(hardcodedSchemas, [ typeName, 'authentication', authName, appName, 'includeStepKeyFields' ], []);

export const getOnlyHiddenFields = (typeName, authName, appName = 'generic') =>
    get(hardcodedSchemas, [ typeName, 'authentication', authName, appName, 'onlyHiddenFields' ], false);

export const getAdditionalStepFields = (fields, stepKey) => fields.filter(field => field.stepKey === stepKey)
.map(({ stepKey, ...field }) => field);

export const getNoStepsFields = (fields, additionalStepKeys = []) => fields.filter(field => !field.stepKey || additionalStepKeys.includes(field.stepKey));

export const injectAuthFieldsInfo = (fields, type, auth, applicationName) => fields.map((field) => {
    const specificFields = get(hardcodedSchemas, [ type, 'authentication', auth, applicationName ]);

    const hardcodedField = specificFields ? get(specificFields, field.name) :
        get(hardcodedSchemas, [ type, 'authentication', auth, 'generic', field.name ]);

    const resultedField = hardcodedField ? { ...field, ...hardcodedField } : field;

    if (resultedField.name === 'authentication.password') {
        resultedField.component = 'authentication';
    }

    return resultedField;
});

export const injectEndpointFieldsInfo = (fields, type) => fields.map((field) => {
    const hardcodedField = get(hardcodedSchemas, [ type, 'endpoint', field.name ]);

    return hardcodedField ? { ...field, ...hardcodedField } : field;
});

export const getAdditionalAuthFields = (type, auth, applicationName = 'generic') =>
    get(hardcodedSchemas, [ type, 'authentication', auth, applicationName, 'additionalFields' ], []);

export const getAdditionalEndpointFields = (type) => get(hardcodedSchemas, [ type, 'endpoint', 'additionalFields' ], []);

export const createEndpointStep = (endpoint, typeName) => ({
    ...endpoint,
    fields: [
        ...getAdditionalEndpointFields(typeName),
        ...injectEndpointFieldsInfo(endpoint.fields, typeName)
    ],
    name: `${typeName}-endpoint`,
    nextStep: 'summary'
});

export const createAdditionalSteps = (additionalSteps, name, authName, hasEndpointStep, fields, appName = 'generic') =>
    additionalSteps.map((step) => {
        const stepKey = step.name || `${name}-${authName}-${appName}-additional-step`;

        const skipEndpoint = shouldSkipEndpoint(name, authName, appName);
        const customSteps = hasCustomSteps(name, authName, appName);

        return ({
            name: stepKey,
            nextStep: hasEndpointStep && !skipEndpoint && !customSteps ? `${name}-endpoint` : 'summary',
            ...step,
            fields: [
                ...injectAuthFieldsInfo(step.fields, name, authName, appName),
                ...injectAuthFieldsInfo(getAdditionalStepFields(fields, stepKey), name, authName, appName)
            ]
        });
    });

export const createGenericAuthTypeSelection = (type, endpointFields, disableAuthType) => {
    const auths = type.schema.authentication;
    const hasMultipleAuthTypes = auths.length > 1;

    const fields = [ ...endpointFields ];
    const stepMapper = {};

    if (hasMultipleAuthTypes) {
        auths.forEach((auth) => {
            const additionalIncludesStepKeys = getAdditionalStepKeys(type.name, auth.type);

            const skipEndpoint = shouldSkipEndpoint(type.name, auth.type, 'generic');

            const onlyHiddenFields = getOnlyHiddenFields(type.name, auth.type);
            const authFields = onlyHiddenFields ? auth.fields.filter(({ hideField }) => hideField) : auth.fields;

            fields.push({
                component: 'auth-select',
                name: 'auth_select',
                label: auth.name,
                authName: auth.type,
                validate: [{
                    type: validatorTypes.REQUIRED
                }],
                disableAuthType
            });
            fields.push({
                component: componentTypes.SUB_FORM,
                name: `${auth.type}-subform`,
                className: 'pf-u-pl-md',
                fields: [
                    ...getAdditionalAuthFields(type.name, auth.type),
                    ...injectAuthFieldsInfo(getNoStepsFields(authFields, additionalIncludesStepKeys), type.name, auth.type)
                ],
                condition: {
                    when: 'auth_select',
                    is: auth.type
                },
                hideField: onlyHiddenFields
            });
            stepMapper[auth.type] = getAdditionalSteps(type.name, auth.type).length > 0 ? `${type.name}-${auth.type}-generic-additional-step` :
                endpointFields.length === 0 && !skipEndpoint ? `${type.name}-endpoint` : 'summary';
        });

        return ({
            name: type.name,
            title: <FormattedMessage
                id="wizard.configureCredentials"
                defaultMessage="Configure {title} credentials"
                values={{ title: acronymMapper(type.product_name) }}
            />,
            fields,
            nextStep: {
                when: 'auth_select',
                stepMapper
            }
        });
    } else {
        const auth = auths[0];
        const additionalStepName = `${type.name}-${auth.type}-generic-additional-step`;

        const skipEndpoint = shouldSkipEndpoint(type.name, auth.type, 'generic');

        const nextStep = getAdditionalSteps(type.name, auth.type).length > 0 ? additionalStepName :
            endpointFields.length === 0 && !skipEndpoint ? `${type.name}-endpoint` : 'summary';

        const additionalIncludesStepKeys = getAdditionalStepKeys(type.name, auth.type);
        const hasCustomStep = shouldSkipSelection(type.name, auth.type);

        let stepProps = {};

        if (hasCustomStep) {
            const firstAdditonalStep = getAdditionalSteps(type.name, auth.type).find(({ name }) => !name);
            const additionalFields = getAdditionalStepFields(auth.fields, additionalStepName);

            stepProps = {
                ...firstAdditonalStep,
                fields: [
                    ...fields,
                    ...injectAuthFieldsInfo([ ...firstAdditonalStep.fields, ...additionalFields ], type.name, auth.type)
                ]
            };
        }

        return ({
            name: type.name,
            title: <FormattedMessage
                id="wizard.configureTypeAuthcredentials"
                defaultMessage="Configure {title} - {name} credentials"
                values={{ title: acronymMapper(type.product_name), name: auth.name }}
            />,
            fields: [
                ...fields,
                ...getAdditionalAuthFields(type.name, auth.type),
                ...injectAuthFieldsInfo(getNoStepsFields(auth.fields, additionalIncludesStepKeys), type.name, auth.type)
            ],
            nextStep,
            ...stepProps
        });
    }
};

export const createSpecificAuthTypeSelection = (type, appType, endpointFields, disableAuthType) => {
    const auths = type.schema.authentication;
    const supportedAuthTypes = appType.supported_authentication_types[type.name];
    const hasMultipleAuthTypes = supportedAuthTypes.length > 1;

    const fields = [ ...endpointFields ];
    const stepMapper = {};

    if (hasMultipleAuthTypes) {
        auths.filter(({ type: authType }) => supportedAuthTypes.includes(authType)).forEach((auth) => {
            const appName = hardcodedSchema(type.name, auth.type, appType.name) ? appType.name : 'generic';

            const skipEndpoint = shouldSkipEndpoint(type.name, auth.type, appName);
            const customSteps = hasCustomSteps(type.name, auth.type, appName);

            let nextStep;

            if (getAdditionalSteps(type.name, auth.type, appType.name).length > 0) {
                nextStep = `${type.name}-${auth.type}-${appType.name}-additional-step`;
            } else if (endpointFields.length === 0 && !skipEndpoint && !customSteps) {
                nextStep = `${type.name}-endpoint`;
            } else {
                nextStep = 'summary';
            }

            const additionalIncludesStepKeys = getAdditionalStepKeys(type.name, auth.type, appName);

            const onlyHiddenFields = getOnlyHiddenFields(type.name, auth.type, appName);
            const authFields = onlyHiddenFields ? auth.fields.filter(({ hideField }) => hideField) : auth.fields;

            fields.push({
                component: 'auth-select',
                name: 'auth_select',
                label: auth.name,
                authName: auth.type,
                validate: [{
                    type: validatorTypes.REQUIRED
                }],
                supportedAuthTypes: appType.supported_authentication_types[type.name],
                disableAuthType
            });
            fields.push({
                component: componentTypes.SUB_FORM,
                name: `${auth.type}-subform`,
                className: 'pf-u-pl-md',
                fields: [
                    ...getAdditionalAuthFields(type.name, auth.type, appName),
                    ...injectAuthFieldsInfo(getNoStepsFields(authFields, additionalIncludesStepKeys), type.name, auth.type, appName)
                ],
                condition: {
                    when: 'auth_select',
                    is: auth.type
                },
                hideField: onlyHiddenFields
            });
            stepMapper[auth.type] = nextStep;
        });

        return ({
            name: `${type.name}-${appType.id}`,
            title: <FormattedMessage id="wizard.chooseAuthType" defaultMessage="Choose authentication type" />,
            fields,
            nextStep: {
                when: 'auth_select',
                stepMapper
            }
        });
    } else {
        const auth = auths.find(({ type: authType }) => supportedAuthTypes.includes(authType));
        const appName = hardcodedSchema(type.name, auth.type, appType.name) ? appType.name : 'generic';;

        const additionalStepName = `${type.name}-${auth.type}-${appType.name}-additional-step`;

        const skipEndpoint = shouldSkipEndpoint(type.name, auth.type, appName);
        const customSteps = hasCustomSteps(type.name, auth.type, appName);

        let nextStep;

        if (getAdditionalSteps(type.name, auth.type, appName).length > 0) {
            nextStep = additionalStepName;
        } else if (endpointFields.length === 0 && !skipEndpoint) {
            nextStep = `${type.name}-endpoint`;
        } else {
            nextStep = 'summary';
        }

        const additionalIncludesStepKeys = getAdditionalStepKeys(type.name, auth.type, appName);
        const hasCustomStep = shouldSkipSelection(type.name, auth.type, appName);

        let stepProps = {};

        if (hasCustomStep) {
            const firstAdditonalStep = getAdditionalSteps(type.name, auth.type, appName).find(({ name }) => !name);
            const additionalFields = getAdditionalStepFields(auth.fields, additionalStepName);

            if (firstAdditonalStep.nextStep) {
                nextStep = firstAdditonalStep.nextStep;
            } else if (endpointFields.length === 0 && !skipEndpoint && !customSteps) {
                nextStep = `${type.name}-endpoint`;
            } else {
                nextStep = 'summary';
            }

            stepProps = {
                ...firstAdditonalStep,
                fields: [
                    ...fields,
                    ...injectAuthFieldsInfo([ ...firstAdditonalStep.fields, ...additionalFields ], type.name, auth.type, appName)
                ]
            };
        }

        return ({
            name: `${type.name}-${appType.id}`,
            title: <FormattedMessage
                id="wizard.configureCredentials"
                defaultMessage="Configure {title} credentials"
                title={{ title: auth.name }}
            />,
            fields: [
                ...fields,
                ...getAdditionalAuthFields(type.name, auth.type, appName),
                ...injectAuthFieldsInfo(getNoStepsFields(auth.fields, additionalIncludesStepKeys), type.name, auth.type, appName)
            ],
            nextStep,
            ...stepProps
        });
    }
};

export const schemaBuilder = (sourceTypes, appTypes, disableAuthType) => {
    const schema = [];

    sourceTypes.forEach(type => {
        const appendEndpoint = type.schema.endpoint.hidden ? type.schema.endpoint.fields : [];
        const hasEndpointStep = appendEndpoint.length === 0;

        schema.push(createGenericAuthTypeSelection(type, appendEndpoint, disableAuthType));

        appTypes.forEach(appType => {
            if (appType.supported_source_types.includes(type.name)) {
                schema.push(createSpecificAuthTypeSelection(type, appType, appendEndpoint, disableAuthType));
            }
        });

        type.schema.authentication.forEach(auth => {
            const additionalSteps = getAdditionalSteps(type.name, auth.type);

            if (additionalSteps.length > 0) {
                schema.push(...createAdditionalSteps(additionalSteps, type.name, auth.type, hasEndpointStep, auth.fields));
            }

            appTypes.forEach(appType => {
                const appAdditionalSteps = getAdditionalSteps(type.name, auth.type, appType.name);

                if (appAdditionalSteps.length > 0) {
                    schema.push(...createAdditionalSteps(appAdditionalSteps, type.name, auth.type, hasEndpointStep, auth.fields, appType.name));
                }
            });
        });

        if (hasEndpointStep) {
            schema.push(createEndpointStep(type.schema.endpoint, type.name));
        }
    });

    return schema;
};
