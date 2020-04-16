import {
    injectAuthFieldsInfo,
    injectEndpointFieldsInfo,
    getAdditionalAuthFields,
    getAdditionalEndpointFields,
    createEndpointStep,
    createAdditionalSteps,
    schemaBuilder,
    getAdditionalStepFields,
    getNoStepsFields,
    getAdditionalSteps,
    shouldSkipSelection,
    getAdditionalStepKeys,
    createGenericAuthTypeSelection,
    createSpecificAuthTypeSelection,
    createEndpointFlagger
} from '../../addSourceWizard/schemaBuilder';
import hardcodedSchemas from '../../addSourceWizard/hardcodedSchemas';
import sourceTypes, { AMAZON_TYPE, OPENSHIFT_TYPE, AZURE_TYPE } from '../helpers/sourceTypes';
import applicationTypes, { COST_MANAGEMENT_APP, TOPOLOGY_INV_APP } from '../helpers/applicationTypes';
import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';

describe('schema builder', () => {
    describe('createEndpointFlagger', () => {
        const INITIAL_SCHEMA = {
            component: componentTypes.TEXT_FIELD,
            name: 'noEndpoint',
            hideField: true,
            initializeOnMount: true
        };

        it('creates object with true', () => {
            expect(createEndpointFlagger(true)).toEqual({
                ...INITIAL_SCHEMA,
                initialValue: true
            });
        });

        it('creates object with empty string as a false', () => {
            expect(createEndpointFlagger(false)).toEqual({
                ...INITIAL_SCHEMA,
                initialValue: false
            });
        });
    });

    describe('stepKey fields', () => {
        const STEP_KEY = 'pepa';
        const NO_STEP_FIELD_1 = { name: 'cosi-1' };
        const NO_STEP_FIELD_2 = { name: 'cosi-2' };
        const STEP_FIELD_1 = { name: 'cosi-a-1', stepKey: STEP_KEY };
        const NO_STEP_FIELD_3 = { name: 'cosi-3' };
        const STEP_FIELD_2 = { name: 'cosi-a-2', stepKey: STEP_KEY };

        const NO_STEP_FIELDS = [
            NO_STEP_FIELD_1,
            NO_STEP_FIELD_2,
            NO_STEP_FIELD_3
        ];

        const STEP_FIELDS = [
            STEP_FIELD_1,
            STEP_FIELD_2
        ];

        const FIELDS = [
            ...NO_STEP_FIELDS,
            ...STEP_FIELDS
        ];

        const STEP_FIELDS_PARSED = [
            { ...STEP_FIELD_1, stepKey: undefined },
            { ...STEP_FIELD_2, stepKey: undefined }
        ];

        describe('getAdditionalStepFields', () => {
            it('returns fields with stepKey and removes stepKey', () => {
                expect(getAdditionalStepFields(FIELDS, STEP_KEY)).toEqual(STEP_FIELDS_PARSED);
            });
        });

        describe('getNoStepsFields', () => {
            it('returns fields with no stepKey', () => {
                expect(getNoStepsFields(FIELDS)).toEqual(NO_STEP_FIELDS);
            });
        });
    });

    describe('getAdditionalSteps', () => {
        it('returns additional steps for amazon-arn-cost-management', () => {
            expect(getAdditionalSteps('amazon', 'arn', COST_MANAGEMENT_APP.name)).toEqual(
                hardcodedSchemas.amazon.authentication.arn[COST_MANAGEMENT_APP.name].additionalSteps
            );
        });
    });

    describe('getAdditionalEndpointFields', () => {
        it('returns additionalEndpointFields for openshift', () => {
            expect(getAdditionalEndpointFields('openshift')).toEqual(
                hardcodedSchemas.openshift.endpoint.additionalFields
            );
        });

        it('returns additionalEndpointFields for amazon (empty)', () => {
            expect(getAdditionalEndpointFields('amazon')).toEqual([]);
        });
    });

    describe('getAdditionalAuthFields', () => {
        it('returns additionalAuthFields for openshift token, generic', () => {
            expect(getAdditionalAuthFields('openshift', 'token', 'generic')).toEqual(
                hardcodedSchemas.openshift.authentication.token.generic.additionalFields
            );
        });

        it('returns additionalAuthFields for amazon arn (empty)', () => {
            expect(getAdditionalAuthFields('amazon', 'arn', 'generic')).toEqual([]);
        });
    });

    describe('injectEndpointFieldsInfo', () => {
        const FIELDS = [{
            name: 'url',
            component: 'cosi'
        }];

        it('returns injected fields for openshift token', () => {
            expect(injectEndpointFieldsInfo(FIELDS, 'openshift')).toEqual([
                {
                    ...FIELDS[0],
                    ...hardcodedSchemas.openshift.endpoint.url
                }
            ]);
        });

        it('returns uninjected fields', () => {
            expect(injectEndpointFieldsInfo(FIELDS, 'amazon')).toEqual(FIELDS);
        });
    });

    describe('injectAuthFieldsInfo', () => {
        const FIELDS = [{
            name: 'authentication.username',
            component: 'cosi'
        }];

        it('returns injected fields for amazon access_key_secret_key', () => {
            expect(injectAuthFieldsInfo(FIELDS, 'amazon', 'access_key_secret_key', 'generic')).toEqual([
                {
                    ...FIELDS[0],
                    ...hardcodedSchemas.amazon.authentication.access_key_secret_key.generic['authentication.username']
                }
            ]);
        });

        it('returns uninjected fields', () => {
            expect(injectAuthFieldsInfo(FIELDS, 'openshift', 'token', 'generic')).toEqual(FIELDS);
        });

        it('removes password requirements', () => {
            const disablePassword = true;

            const passwordField = { name: 'authentication.password', isRequired: true, validate: [{ type: validatorTypes.REQUIRED }, { type: 'cosi' }] };
            const unchangedField = { name: 'unchanged', isRequired: true, validate: [{ type: validatorTypes.REQUIRED }] };

            const fields = [
                passwordField,
                unchangedField
            ];

            expect(injectAuthFieldsInfo(fields, 'nonsense', 'nonsense', 'generic', disablePassword)).toEqual([
                { ...passwordField, component: 'authentication' },
                unchangedField
            ]);
        });
    });

    describe('createEndpointStep', () => {
        it('returns createEndpointStep for openshift', () => {
            const ENDPOINT = sourceTypes.find(({ name }) => name === 'openshift').schema.endpoint;

            expect(createEndpointStep(ENDPOINT, 'openshift')).toEqual(
                expect.objectContaining({
                    fields: [
                        ...getAdditionalEndpointFields('openshift'),
                        ...injectEndpointFieldsInfo(ENDPOINT.fields, 'openshift')
                    ],
                    title: sourceTypes.find(({ name }) => name === 'openshift').schema.endpoint.title,
                    stepKey: 'openshift-endpoint',
                    nextStep: 'summary'
                })
            );
        });
    });

    describe('createAdditionalSteps', () => {
        const ADDITIONAL_STEPS = [
            { name: 'step-1', nextStep: 'step-2', fields: [ 'a' ] },
            { name: 'step-2', stepKey: 'step-2', nextStep: 'step-3', fields: [ 'b' ] },
            { name: 'step-3', stepKey: 'step-3', fields: [ 'c' ] }
        ];

        const INSERTED_STEP = { name: 'component-1', stepKey: 'red-hat-generic-additional-step' };

        const TYPES_FIELDS = [
            INSERTED_STEP,
            { name: 'component-2' }
        ];

        it('returns createAdditionalSteps', () => {
            const HAS_ENDPOINT = false;

            expect(createAdditionalSteps(ADDITIONAL_STEPS, 'red', 'hat', HAS_ENDPOINT, TYPES_FIELDS)).toEqual([
                {
                    ...ADDITIONAL_STEPS[0],
                    fields: [
                        ...ADDITIONAL_STEPS[0].fields,
                        { ...INSERTED_STEP, stepKey: undefined } // insert the right field
                    ],
                    nextStep: 'step-2',
                    stepKey: 'red-hat-generic-additional-step'
                },
                {
                    ...ADDITIONAL_STEPS[1],
                    fields: expect.any(Array),
                    nextStep: 'step-3'
                },
                {
                    ...ADDITIONAL_STEPS[2],
                    fields: expect.any(Array),
                    nextStep: 'summary'
                }
            ]);
        });

        it('returns createAdditionalSteps with endpoint', () => {
            const HAS_ENDPOINT = true;

            expect(createAdditionalSteps(ADDITIONAL_STEPS, 'red', 'hat', HAS_ENDPOINT, TYPES_FIELDS)).toEqual([
                {
                    ...ADDITIONAL_STEPS[0],
                    fields: expect.any(Array),
                    nextStep: 'step-2',
                    stepKey: 'red-hat-generic-additional-step'
                },
                {
                    ...ADDITIONAL_STEPS[1],
                    fields: expect.any(Array),
                    nextStep: 'step-3'
                },
                {
                    ...ADDITIONAL_STEPS[2],
                    fields: expect.any(Array),
                    nextStep: 'red-endpoint'
                }
            ]);
        });
    });

    describe('Cost management shouldSkipSelection', () => {
        it('should skip selection page for AWS+CM', () => {
            expect(shouldSkipSelection(AMAZON_TYPE.name, 'arn', COST_MANAGEMENT_APP.name)).toEqual(true);
        });

        it('should skip selection for openshift', () => {
            expect(shouldSkipSelection(OPENSHIFT_TYPE.name, 'token', COST_MANAGEMENT_APP.name)).toEqual(true);
        });
    });

    describe('getAdditionalStepKeys', () => {
        it('should get Additional Step Keys for generic AWS', () => {
            const expectedStepKeys = hardcodedSchemas.amazon.authentication.arn.generic.includeStepKeyFields;

            expect(getAdditionalStepKeys(AMAZON_TYPE.name, 'arn')).toEqual(expectedStepKeys);
        });

        it('should not get Additional Step Keys for openshift', () => {
            expect(getAdditionalStepKeys(OPENSHIFT_TYPE.name, 'token')).toEqual([]);
        });
    });

    describe('generate auth selection pages', () => {
        let expectedSchema;
        const APPEND_ENDPOINT_FIELDS = [ true ];
        const EMPTY_APPEND_ENDPOINT = [ ];

        describe('createGenericAuthTypeSelection', () => {
            it('generate single selection', () => {
                const fields = [
                    ...OPENSHIFT_TYPE.schema.authentication[0].fields.filter(({ stepKey }) => !stepKey)
                    .map((field) => expect.objectContaining(field.name === 'authentication.password' ?
                        { ...field, component: 'authentication' } : field
                    )),
                    createEndpointFlagger(false)
                ];

                expectedSchema = expect.objectContaining({
                    fields: expect.arrayContaining(fields),
                    title: expect.any(String),
                    stepKey: OPENSHIFT_TYPE.name,
                    name: OPENSHIFT_TYPE.name,
                    nextStep: 'summary'
                });

                expect(createGenericAuthTypeSelection(OPENSHIFT_TYPE, APPEND_ENDPOINT_FIELDS)).toEqual(expectedSchema);
            });

            it('generate single selection with endpoint', () => {
                expectedSchema = expect.objectContaining({
                    fields: expect.any(Array),
                    title: expect.any(String),
                    stepKey: OPENSHIFT_TYPE.name,
                    name: OPENSHIFT_TYPE.name,
                    nextStep: `${OPENSHIFT_TYPE.name}-endpoint`
                });

                expect(createGenericAuthTypeSelection(OPENSHIFT_TYPE, EMPTY_APPEND_ENDPOINT)).toEqual(expectedSchema);
            });

            it('generate multiple selection', () => {
                const arnSelect = expect.objectContaining({ component: 'auth-select', authName: 'arn' });
                const secretKey = expect.objectContaining({ component: 'auth-select', authName: 'access_key_secret_key' });

                expectedSchema = expect.objectContaining({
                    fields: expect.arrayContaining([
                        arnSelect,
                        secretKey
                    ]),
                    title: expect.any(String),
                    stepKey: AMAZON_TYPE.name,
                    name: AMAZON_TYPE.name,
                    nextStep: {
                        when: expect.any(String),
                        stepMapper: {
                            access_key_secret_key: 'amazon-access_key_secret_key-generic-additional-step',
                            arn: 'summary'
                        }
                    }
                });

                expect(createGenericAuthTypeSelection(AMAZON_TYPE, APPEND_ENDPOINT_FIELDS)).toEqual(expectedSchema);
            });
        });

        describe('createSpecificAuthTypeSelection', () => {
            it('generate single selection', () => {
                const fields = [
                    ...AZURE_TYPE.schema.authentication[0].fields.filter(({ stepKey }) => !stepKey),
                    createEndpointFlagger(false)
                ];
                const expectedName = `${AZURE_TYPE.name}-${TOPOLOGY_INV_APP.id}`;

                expectedSchema = expect.objectContaining({
                    fields: expect.arrayContaining(fields),
                    title: expect.any(String),
                    stepKey: expectedName,
                    name: expectedName,
                    nextStep: 'summary'
                });

                expect(createSpecificAuthTypeSelection(AZURE_TYPE, TOPOLOGY_INV_APP, APPEND_ENDPOINT_FIELDS)).toEqual(expectedSchema);
            });

            it('generate single selection with endpoints', () => {
                const fields = AZURE_TYPE.schema.authentication[0].fields.filter(({ stepKey }) => !stepKey);
                const expectedName = `${AZURE_TYPE.name}-${TOPOLOGY_INV_APP.id}`;

                expectedSchema = expect.objectContaining({
                    fields: expect.arrayContaining(fields),
                    title: expect.any(String),
                    stepKey: expectedName,
                    name: expectedName,
                    nextStep: `${AZURE_TYPE.name}-endpoint`
                });

                expect(createSpecificAuthTypeSelection(AZURE_TYPE, TOPOLOGY_INV_APP, EMPTY_APPEND_ENDPOINT)).toEqual(expectedSchema);
            });

            it('generate with custom steps', () => {
                const expectedName = `${AMAZON_TYPE.name}-${COST_MANAGEMENT_APP.id}`;
                const firstAdditionalStep = hardcodedSchemas[AMAZON_TYPE.name]
                .authentication.arn[COST_MANAGEMENT_APP.name].additionalSteps.find(({ stepKey }) => !stepKey);
                const fields = firstAdditionalStep.fields.map((field) => expect.objectContaining(field));

                expectedSchema = expect.objectContaining({
                    fields: expect.arrayContaining(fields),
                    title: firstAdditionalStep.title,
                    stepKey: expectedName,
                    name: expectedName,
                    nextStep: firstAdditionalStep.nextStep
                });

                expect(createSpecificAuthTypeSelection(AMAZON_TYPE, COST_MANAGEMENT_APP, APPEND_ENDPOINT_FIELDS)).toEqual(expectedSchema);
            });
        });
    });

    describe('schemaBuilder', () => {
        it('builds schema', () => {
            const schema = schemaBuilder(sourceTypes.filter(({ schema }) => schema), applicationTypes);

            expect(schema).toEqual(expect.arrayContaining([ expect.any(Object) ]));
            expect(schema).toHaveLength(26);
        });
    });
});
