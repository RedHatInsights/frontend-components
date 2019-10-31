import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import hardcodedSchemas from './hardcodedSchemas';
import get from 'lodash/get';

export const getAdditionalSteps = (typeName, authName, appName = 'generic') =>
    get(hardcodedSchemas, [ typeName, 'authentication', authName, appName, 'additionalSteps' ], []);

export const getAdditionalStepFields = (fields, stepKey) => fields.filter(field => field.stepKey === stepKey)
.map(field => ({ ...field, stepKey: undefined }));

export const getNoStepsFields = (fields) => fields.filter(field => !field.stepKey);

export const injectAuthFieldsInfo = (fields, type, auth, applicationName) => fields.map((field) => {
    const specificFields = get(hardcodedSchemas, [ type, 'authentication', auth, applicationName ]);

    const hardcodedField = specificFields ? get(specificFields, field.name) :
        get(hardcodedSchemas, [ type, 'authentication', auth, 'generic', field.name ]);

    return hardcodedField ? { ...field, ...hardcodedField } : field;
});

export const injectEndpointFieldsInfo = (fields, type) => fields.map((field) => {
    const hardcodedField = get(hardcodedSchemas, [ type, 'endpoint', field.name ]);

    return hardcodedField ? { ...field, ...hardcodedField } : field;
});

export const getAdditionalAuthFields = (type, auth, applicationName) => {
    const specificFields = get(hardcodedSchemas, [ type, 'authentication', auth, applicationName, 'additionalFields' ]);

    return specificFields ? specificFields :
        get(hardcodedSchemas, [ type, 'authentication', auth, 'generic', 'additionalFields' ], []);
};

export const getAdditionalEndpointFields = (type) => get(hardcodedSchemas, [ type, 'endpoint', 'additionalFields' ], []);

export const createAuthSelection = (type, applicationTypes, sourceTypes, endpointFields = [], disableAuthType = false) => {
    const auths = type.schema.authentication;

    let fields = [ ...endpointFields ];

    const stepMapper = {};

    // generic <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    const genericSelection = {
        component: componentTypes.SUB_FORM,
        name: 'generic-selection',
        fields: [{
            component: 'description',
            name: 'pokus',
            Content: () => `POKUS generic ${type.name}`
        }],
        condition: {
            when: 'application.application_type_id',
            isEmpty: true
        }
    };

    fields.push(genericSelection);

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    // preprocess for multiauth <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    const authTypes = applicationTypes.map(({ id, supported_authentication_types }) => {
        const appSupportedAuthTypes = supported_authentication_types[type.name];
        const appSupportsSourceType = appSupportedAuthTypes && appSupportedAuthTypes.length > 0;

        return appSupportsSourceType ? ({
            id,
            supportedAuthTypes: appSupportedAuthTypes.map((authType) => authType)
        }) : undefined;
    }).filter(x => x);

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    const applicationSelection = authTypes.map((authType => {
        let index = 0;
        let authSelects;

        const application = applicationTypes.find(({ id }) => id === authType.id);
        const hasOnlyOneType = authType.supportedAuthTypes.length === 1;

        if (hasOnlyOneType) {
            const supportedType = authType.supportedAuthTypes[0];
            const authentication = type.schema.authentication.find(({ type }) => type === supportedType);

            if (!authentication) {
                return ([]);
            }

            return ({
                component: componentTypes.SUB_FORM,
                name: `${type.name}-${authType.id}`,
                fields: [
                    {
                        component: 'description',
                        name: 'pokus',
                        Content: () => `POKUS ${type.name} ${authType.id} ${JSON.stringify(authTypes)}`
                    },
                    ...getAdditionalAuthFields(type.name, supportedType, application.name),
                    ...injectAuthFieldsInfo(getNoStepsFields(authentication.fields), type.name, supportedType, application.name)
                ],
                condition: {
                    when: 'application.application_type_id',
                    is: authType.id
                }
            });
        } else {
            authSelects = authType.supportedAuthTypes.map((supportedType) => {
                const authentication = type.schema.authentication.find(({ type }) => type === supportedType);
                const authenticationName = authentication && authentication.name;

                if (!authentication || !authenticationName) {
                    return ([]);
                }

                const selection = {
                    component: 'auth-select',
                    name: 'auth_select',
                    label: authenticationName,
                    authName: `${supportedType}-${authType.id}`,
                    validate: [{
                        type: validatorTypes.REQUIRED
                    }],
                    index: index++,
                    applicationTypes,
                    sourceTypes,
                    disableAuthType,
                    authsCount: auths.length
                };

                const authFields = {
                    component: componentTypes.SUB_FORM,
                    name: `${supportedType}-subform`,
                    className: 'pf-u-pl-md',
                    fields: [
                        ...getAdditionalAuthFields(type.name, supportedType, application.name),
                        ...injectAuthFieldsInfo(getNoStepsFields(authentication.fields), type.name, supportedType, application.name)
                    ],
                    condition: {
                        when: 'auth_select',
                        is: `${supportedType}-${authType.id}`
                    }
                };

                return ([
                    selection,
                    authFields
                ]);
            }).flatMap(x => x);

            return ({
                component: componentTypes.SUB_FORM,
                name: `${type.name}-${authType.id}`,
                fields: [
                    {
                        component: 'description',
                        name: 'pokus',
                        Content: () => `POKUS ${type.name} ${authType.id} ${JSON.stringify(authTypes)}`
                    },
                    ...authSelects
                ],
                condition: {
                    when: 'application.application_type_id',
                    is: authType.id
                }
            });
        }
    }));

    fields = [ ...fields, ...applicationSelection ];

    /*auths.forEach((auth, index) => {
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
                ...injectAuthFieldsInfo(getNoStepsFields(auth.fields), type.name, auth.type)
            ],
            condition: {
                when: 'auth_select',
                is: auth.type
            }
        });
        stepMapper[auth.type] = getAdditionalSteps(type.name, auth.type).length > 0 ? `${type.name}-${auth.type}-additional-step` :
            endpointFields.length === 0 ? `${type.name}-endpoint` : 'summary';
    });*/

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

export const createAdditionalSteps = (additionalSteps, name, authName, hasEndpointStep, fields) => additionalSteps.map((step) => {
    const stepKey = step.stepKey || `${name}-${authName}-additional-step`;

    return ({
        stepKey: stepKey,
        nextStep: hasEndpointStep ? `${name}-endpoint` : 'summary',
        ...step,
        fields: [
            ...injectAuthFieldsInfo(step.fields, name, authName),
            ...injectAuthFieldsInfo(getAdditionalStepFields(fields, stepKey), name, authName)
        ]
    });
});

export const createGenericAuthTypeSelection = (type, endpointFields, disableAuthType, applicationTypes, sourceTypes) => {
    // get all authentication types
    const auths = type.schema.authentication;
    const hasMultipleAuthTypes = auths.length > 1;

    const fields = [ ...endpointFields ];
    const stepMapper = {};

    if (hasMultipleAuthTypes) {
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
                    ...injectAuthFieldsInfo(getNoStepsFields(auth.fields), type.name, auth.type)
                ],
                condition: {
                    when: 'auth_select',
                    is: auth.type
                }
            });
            stepMapper[auth.type] = getAdditionalSteps(type.name, auth.type).length > 0 ? `${type.name}-${auth.type}-additional-step` :
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

        const nextStep = getAdditionalSteps(type.name, auth.type).length > 0 ? `${type.name}-${auth.type}-additional-step` :
            endpointFields.length === 0 ? `${type.name}-endpoint` : 'summary';

        return ({
            name: type.name,
            stepKey: type.name,
            title: `Configure ${type.product_name} credentials`,
            fields: [
                ...fields,
                ...getAdditionalAuthFields(type.name, auth.type),
                ...injectAuthFieldsInfo(getNoStepsFields(auth.fields), type.name, auth.type)
            ],
            nextStep
        });
    }
};

export const createSpecificAuthTypeSelection = (sourceType, appType, hasEndpointStep, sourceTypes, appTypes, disableAuthType) => {

    return { stepKey: `${sourceType.name}-${appType.id}`, name: `${sourceType.name}-${appType.id}`, fields: [] };
};

export const schemaBuilder = (sourceTypes, appTypes, disableAuthType) => {
    const schema = [];

    sourceTypes.forEach(type => {
        const appendEndpoint = type.schema.endpoint.hidden ? type.schema.endpoint.fields : [];
        const hasEndpointStep = appendEndpoint.length === 0;

        schema.push(createGenericAuthTypeSelection(type, appendEndpoint, disableAuthType, appTypes, sourceTypes));

        appTypes.forEach(appType => {
            if (appType.supported_source_types.includes(type.name)) {
                const hardSchema = hardcodedSchemas[type.name] && hardcodedSchemas[type.name].authentication;
                if (hardSchema) {
                    const hasSpecificSteps = Object.keys(hardSchema).some((key) => hardSchema[key].hasOwnProperty(appType.name));

                    console.log(type.name, appType.display_name, hasSpecificSteps ? `pushuji ${type.name}-${appType.id}` : 'pouze generic');
                    schema.push(createSpecificAuthTypeSelection(type, appType, appendEndpoint, disableAuthType, appTypes, sourceTypes));
                }
            }
        });

        //schema.push(createAuthSelection(type, appTypes, sourceTypes, appendEndpoint, disableAuthType));

        type.schema.authentication.forEach(auth => {
            const additionalSteps = getAdditionalSteps(type.name, auth.type);
            if (additionalSteps.length > 0) {
                schema.push(...createAdditionalSteps(additionalSteps, type.name, auth.type, hasEndpointStep, auth.fields));
            }
        });

        if (hasEndpointStep) {
            schema.push(createEndpointStep(type.schema.endpoint, type.name));
        }
    });

    console.log(schema);
    return schema;
};
