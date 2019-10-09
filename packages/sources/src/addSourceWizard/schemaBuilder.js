import React from 'react';
import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import { Title } from '@patternfly/react-core';
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

export const createTitle = (title) => ({
    component: 'description',
    name: 'description-title',
    content: <Title headingLevel="h3" size="2xl">{title}</Title>
});

export const createAuthSelection = (type, applicationTypes, sourceTypes, endpointFields = []) => {
    const auths = type.schema.authentication;

    const fields = [
        createTitle('Configure credentials'),
        ...endpointFields
    ];

    const stepMapper = {};

    Object.keys(auths).forEach((key, index) => {
        fields.push({
            component: 'auth-select',
            name: 'auth_select',
            label: auths[key].meta.name,
            authName: key,
            validate: [{
                type: validatorTypes.REQUIRED
            }],
            index,
            applicationTypes,
            sourceTypes
        });
        fields.push({
            component: componentTypes.SUB_FORM,
            name: `${key}-subform`,
            fields: [
                ...getAdditionalAuthFields(type.name, key),
                ...injectAuthFieldsInfo(auths[key].fields, type.name, key)
            ],
            condition: {
                when: 'auth_select',
                is: key
            }
        });
        stepMapper[key] = auths[key].additional_steps ? `${type.name}-${key}-additional-step` :
            endpointFields.length === 0 ? `${type.name}-endpoint` : 'summary';
    });

    return ({
        name: type.name,
        stepKey: type.name,
        title: 'Configure credentials',
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
        createTitle(endpoint.title),
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
    fields: [
        createTitle(step.title),
        ...step.fields
    ]
}));

export const schemaBuilder = (sourceTypes, appTypes) => {
    const schema = [];

    sourceTypes.forEach(type => {
        const appendEndpoint = type.schema.endpoint.hidden ? type.schema.endpoint.fields : [];
        const hasEndpointStep = appendEndpoint.length === 0;

        schema.push(createAuthSelection(type, appTypes, sourceTypes, appendEndpoint));

        Object.keys(type.schema.authentication).forEach(auth => {
            const additionalSteps = type.schema.authentication[auth].additional_steps;
            if (additionalSteps) {
                schema.push(...createAdditionalSteps(additionalSteps, type.name, auth, hasEndpointStep));
            }
        });

        if (hasEndpointStep) {
            schema.push(createEndpointStep(type.schema.endpoint, type.name));
        }
    });

    return schema;
};
