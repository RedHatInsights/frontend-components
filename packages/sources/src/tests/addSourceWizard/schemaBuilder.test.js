import {
    injectAuthFieldsInfo,
    injectEndpointFieldsInfo,
    getAdditionalAuthFields,
    getAdditionalEndpointFields,
    createAuthSelection,
    createEndpointStep,
    createAdditionalSteps,
    schemaBuilder,
    getAdditionalStepFields,
    getNoStepsFields,
    getAdditionalSteps
} from '../../addSourceWizard/schemaBuilder';
import hardcodedSchemas from '../../addSourceWizard/hardcodedSchemas';
import sourceTypes from '../helpers/sourceTypes';
import applicationTypes from '../helpers/applicationTypes';

describe('schema builder', () => {
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
        it('returns additional steps for amazon-arn', () => {
            expect(getAdditionalSteps('amazon', 'arn')).toEqual(
                hardcodedSchemas.amazon.authentication.arn.additionalSteps
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
        it('returns additionalAuthFields for openshift token', () => {
            expect(getAdditionalAuthFields('openshift', 'token')).toEqual(
                hardcodedSchemas.openshift.authentication.token.additionalFields
            );
        });

        it('returns additionalAuthFields for amazon arn (empty)', () => {
            expect(getAdditionalAuthFields('amazon', 'arn')).toEqual([]);
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
            expect(injectAuthFieldsInfo(FIELDS, 'amazon', 'access_key_secret_key')).toEqual([
                {
                    ...FIELDS[0],
                    ...hardcodedSchemas.amazon.authentication.access_key_secret_key['authentication.username']
                }
            ]);
        });

        it('returns uninjected fields', () => {
            expect(injectAuthFieldsInfo(FIELDS, 'openshift', 'token')).toEqual(FIELDS);
        });
    });

    describe('createAuthSelection', () => {
        it('returns authSelection for Amazon', () => {
            expect(createAuthSelection(sourceTypes.find(({ name }) => name === 'amazon'), applicationTypes, sourceTypes, [{ component: 'cosi' }])).toEqual(
                expect.objectContaining({
                    fields: expect.any(Array),
                    title: expect.any(String),
                    stepKey: 'amazon',
                    name: 'amazon',
                    nextStep: {
                        when: expect.any(String),
                        stepMapper: {
                            arn: 'amazon-arn-additional-step',
                            access_key_secret_key: 'summary'
                        }
                    }
                })
            );
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

        const INSERTED_STEP = { name: 'component-1', stepKey: 'red-hat-additional-step' };

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
                    stepKey: 'red-hat-additional-step'
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
                    stepKey: 'red-hat-additional-step'
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

    describe('schemaBuilder', () => {
        it('builds schema', () => {
            const schema = schemaBuilder(sourceTypes.filter(({ schema }) => schema), applicationTypes);

            expect(schema).toEqual(expect.arrayContaining([ expect.any(Object) ]));

            // 4x AuthSelection: Ansible, Azure, AWS, Openshift
            // 5x AWS ARN additional steps
            // 1x Openshift endpoint
            // 1x Ansible endpoint
            expect(schema).toHaveLength(11);
        });
    });
});
