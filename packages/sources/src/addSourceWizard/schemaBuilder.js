import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import hardcodedSchemas from './hardcodedSchemas';
import get from 'lodash/get';

export const injectAuthFieldsInfo = (fields, type, auth) => fields.map((field) => {
    const hardcodedField = get(hardcodedSchemas, [ type, 'authentication', auth, field.name ]);

    return hardcodedField ? { ...field, ...hardcodedField } : field;
});

export const injectEndpointFieldsInfo = (fields, type) => fields.map((field) => {
    const hardcodedField = get(hardcodedSchemas, [ type, 'endpoint', field.name ]);

    return hardcodedField ? { ...field, ...hardcodedField } : field;
});

export const getAdditionalAuthFields = (type, auth) => get(hardcodedSchemas, [ type, 'authentication', auth, 'additionalFields' ], []);

export const getAdditionalEndpointFields = (type) => get(hardcodedSchemas, [ type, 'endpoint', 'additionalFields' ], []);

export const createAuthSelection = (type, applicationTypes, sourceTypes, endpointFields = [], disableAuthType = false) => {
    const auths = type.schema.authentication;

    const fields = [ ...endpointFields ];

    const stepMapper = {};

    auths.forEach((auth, index) => {
        fields.push({
            component: 'auth-select',
            name: 'auth_select',
            label: auth.name,
            authName: auth.type,
            validate: [{
                type: validatorTypes.REQUIRED
            }],
            index,
            applicationTypes,
            sourceTypes,
            disableAuthType,
            authsCount: auths.length
        });
        fields.push({
            component: componentTypes.SUB_FORM,
            name: `${auth.type}-subform`,
            className: 'pf-u-pl-md',
            fields: [
                ...getAdditionalAuthFields(type.name, auth.type),
                ...injectAuthFieldsInfo(auth.fields, type.name, auth.type)
            ],
            condition: {
                when: 'auth_select',
                is: auth.type
            }
        });
        stepMapper[auth.type] = auth.additional_steps ? `${type.name}-${auth.type}-additional-step` :
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
};

export const createEndpointStep = (endpoint, typeName) => ({
    ...endpoint,
    fields: [
        ...getAdditionalEndpointFields(typeName),
        ...injectEndpointFieldsInfo(endpoint.fields, typeName)
    ],
    stepKey: `${typeName}-endpoint`,
    nextStep: 'summary'
});

export const createAdditionalSteps = (additionalSteps, name, authName, hasEndpointStep) => additionalSteps.map((step) => ({
    stepKey: `${name}-${authName}-additional-step`,
    nextStep: hasEndpointStep ? `${name}-endpoint` : 'summary',
    ...step,
    fields: [ ...injectAuthFieldsInfo(step.fields, name, authName) ]
}));

export const schemaBuilder = (sourceTypes, appTypes, disableAuthType) => {
    const schema = [];

    sourceTypes.forEach(type => {
        const appendEndpoint = type.schema.endpoint.hidden ? type.schema.endpoint.fields : [];
        const hasEndpointStep = appendEndpoint.length === 0;

        schema.push(createAuthSelection(type, appTypes, sourceTypes, appendEndpoint, disableAuthType));

        type.schema.authentication.forEach(auth => {
            const additionalSteps = auth.additional_steps;
            if (additionalSteps) {
                schema.push(...createAdditionalSteps(additionalSteps, type.name, auth.type, hasEndpointStep));
            }
        });

        if (hasEndpointStep) {
            schema.push(createEndpointStep(type.schema.endpoint, type.name));
        }
    });

    return schema;
};
