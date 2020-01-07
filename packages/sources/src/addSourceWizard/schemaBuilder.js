import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import hardcodedSchemas from './hardcodedSchemas';
import get from 'lodash/get';

export const hardcodedSchema = (typeName, authName, appName) =>
    get(hardcodedSchemas, [ typeName, 'authentication', authName, appName ], undefined);

export const getAdditionalSteps = (typeName, authName, appName = 'generic') =>
    get(hardcodedSchemas, [ typeName, 'authentication', authName, appName, 'additionalSteps' ], []);

export const shouldSkipSelection = (typeName, authName, appName = 'generic') =>
    get(hardcodedSchemas, [ typeName, 'authentication', authName, appName, 'skipSelection' ], false);

export const shouldSkipEndpoint = (typeName, authName, appName = 'generic') =>
    get(hardcodedSchemas, [ typeName, 'authentication', authName, appName, 'skipEndpoint' ], false);

export const getAdditionalStepKeys = (typeName, authName, appName = 'generic') =>
    get(hardcodedSchemas, [ typeName, 'authentication', authName, appName, 'includeStepKeyFields' ], []);

export const getOnlyHiddenFields = (typeName, authName, appName = 'generic') =>
    get(hardcodedSchemas, [ typeName, 'authentication', authName, appName, 'onlyHiddenFields' ], false);

export const getAdditionalStepFields = (fields, stepKey) => fields.filter(field => field.stepKey === stepKey)
.map(field => ({ ...field, stepKey: undefined }));

export const getNoStepsFields = (fields, additionalStepKeys = []) => fields.filter(field => !field.stepKey || additionalStepKeys.includes(field.stepKey));

export const removeRequiredValidator = (validate = []) =>
    validate.filter(validation => validation.type !== validatorTypes.REQUIRED);

export const injectAuthFieldsInfo = (fields, type, auth, applicationName, doNotRequirePassword) => fields.map((field) => {
    const specificFields = get(hardcodedSchemas, [ type, 'authentication', auth, applicationName ]);

    const hardcodedField = specificFields ? get(specificFields, field.name) :
        get(hardcodedSchemas, [ type, 'authentication', auth, 'generic', field.name ]);

    const resultedField = hardcodedField ? { ...field, ...hardcodedField } : field;

    if (resultedField.name === 'authentication.password' && doNotRequirePassword) {
        resultedField.helperText = `Changing this resets your current ${resultedField.label}.`;
        resultedField.isRequired = false;
        resultedField.validate = removeRequiredValidator(resultedField.validate);
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
    stepKey: `${typeName}-endpoint`,
    nextStep: 'summary'
});

export const createAdditionalSteps = (additionalSteps, name, authName, hasEndpointStep, fields, appName = 'generic', doNotRequirePassword) =>
    additionalSteps.map((step) => {
        const stepKey = step.stepKey || `${name}-${authName}-${appName}-additional-step`;

        const skipEndpoint = shouldSkipEndpoint(name, authName, appName);

        return ({
            stepKey: stepKey,
            nextStep: hasEndpointStep && !skipEndpoint ? `${name}-endpoint` : 'summary',
            ...step,
            fields: [
                ...injectAuthFieldsInfo(step.fields, name, authName, appName, doNotRequirePassword),
                ...injectAuthFieldsInfo(getAdditionalStepFields(fields, stepKey), name, authName, appName, doNotRequirePassword)
            ]
        });
    });

export const createEndpointFlagger = (skipEndpoint) => ({
    component: componentTypes.TEXT_FIELD,
    name: 'noEndpoint',
    hideField: true,
    initialValue: skipEndpoint || '',
    initializeOnMount: true
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

            fields.push(createEndpointFlagger(skipEndpoint));

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
                endpointFields.length === 0 ? `${type.name}-endpoint` : 'summary';
        });

        return ({
            name: type.name,
            stepKey: type.name,
            title: `Configure ${type.product_name} credentials`,
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

        fields.push(createEndpointFlagger(skipEndpoint));

        const nextStep = getAdditionalSteps(type.name, auth.type).length > 0 ? additionalStepName :
            endpointFields.length === 0 ? `${type.name}-endpoint` : 'summary';

        const additionalIncludesStepKeys = getAdditionalStepKeys(type.name, auth.type);
        const hasCustomStep = shouldSkipSelection(type.name, auth.type);

        let stepProps = {};

        if (hasCustomStep) {
            const firstAdditonalStep = getAdditionalSteps(type.name, auth.type).find(({ stepKey }) => !stepKey);
            const additionalFields = getAdditionalStepFields(auth.fields, additionalStepName);

            stepProps = {
                ...firstAdditonalStep,
                fields: [
                    ...fields,
                    ...injectAuthFieldsInfo([ ...firstAdditonalStep.fields, ...additionalFields ], type.name, auth.type)
                ],
                stepKey: type.name
            };
        }

        return ({
            name: type.name,
            stepKey: type.name,
            title: `Configure ${type.product_name} - ${auth.name} credentials`,
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

export const createSpecificAuthTypeSelection = (type, appType, endpointFields, disableAuthType, doNotRequirePassword) => {
    const auths = type.schema.authentication;
    const supportedAuthTypes = appType.supported_authentication_types[type.name];
    const hasMultipleAuthTypes = supportedAuthTypes.length > 1;

    const fields = [ ...endpointFields ];
    const stepMapper = {};

    if (hasMultipleAuthTypes) {
        auths.filter(({ type: authType }) => supportedAuthTypes.includes(authType)).forEach((auth) => {
            const appName = hardcodedSchema(type.name, auth.type, appType.name) ? appType.name : 'generic';

            const skipEndpoint = shouldSkipEndpoint(type.name, auth.type, appName);

            fields.push(createEndpointFlagger(skipEndpoint));

            let nextStep;

            if (getAdditionalSteps(type.name, auth.type, appType.name).length > 0) {
                nextStep = `${type.name}-${auth.type}-additional-step`;
            } else if (endpointFields.length === 0 && !skipEndpoint) {
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
                    ...injectAuthFieldsInfo(getNoStepsFields(authFields, additionalIncludesStepKeys), type.name, auth.type, appName, doNotRequirePassword)
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
            name: type.name,
            stepKey: type.name,
            title: `Configure ${type.product_name} credentials`,
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

        fields.push(createEndpointFlagger(skipEndpoint));

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
            const firstAdditonalStep = getAdditionalSteps(type.name, auth.type, appName).find(({ stepKey }) => !stepKey);
            const additionalFields = getAdditionalStepFields(auth.fields, additionalStepName);

            if (firstAdditonalStep.nextStep) {
                nextStep = firstAdditonalStep.nextStep;
            } else if (endpointFields.length === 0 && !skipEndpoint) {
                nextStep = `${type.name}-endpoint`;
            } else {
                nextStep = 'summary';
            }

            stepProps = {
                ...firstAdditonalStep,
                fields: [
                    ...fields,
                    ...injectAuthFieldsInfo([ ...firstAdditonalStep.fields, ...additionalFields ], type.name, auth.type, appName, doNotRequirePassword)
                ],
                stepKey: `${type.name}-${appType.id}`
            };
        }

        return ({
            stepKey: `${type.name}-${appType.id}`,
            name: `${type.name}-${appType.id}`,
            title: `Configure ${auth.name} credentials`,
            fields: [
                ...fields,
                ...getAdditionalAuthFields(type.name, auth.type, appName),
                ...injectAuthFieldsInfo(getNoStepsFields(auth.fields, additionalIncludesStepKeys), type.name, auth.type, appName, doNotRequirePassword)
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
