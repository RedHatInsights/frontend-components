import {
    createGenericAuthTypeSelection
} from '../../../addSourceWizard/schemaBuilder';

jest.mock('../../../addSourceWizard/hardcodedSchemas', () => ({
    openshiftAdditionalStep: {
        authentication: {
            token: {
                generic: {
                    additionalSteps: [
                        {}
                    ]
                }
            }
        }
    }
}));

describe('generate auth selection pages', () => {
    let expectedSchema;
    const APPEND_ENDPOINT_FIELDS = [ true ];
    const EMPTY_APPEND_ENDPOINT = [ ];
    const NOT_EDITING = false;

    const ONE_SINGLE_SELECTION_TYPE = {
        id: '1',
        name: 'openshift',
        product_name: 'OpenShift Container Platform',
        schema: {
            authentication: [{
                type: 'token',
                name: 'Token',
                fields: [
                    {
                        component: 'text-field',
                        name: 'authentication.password',
                        label: 'Token'
                    }
                ]
            }],
            endpoint: {
                title: 'Configure OpenShift endpoint',
                fields: [
                    {
                        component: 'text-field',
                        name: 'endpoint.certificate_authority',
                        label: 'Certificate Authority'
                    }
                ]
            }
        }
    };

    const MULTIPLE_SELECTION_TYPE = {
        id: '1',
        name: 'openshift',
        product_name: 'OpenShift Container Platform',
        schema: {
            authentication: [{
                type: 'token',
                name: 'Token',
                fields: [
                    {
                        component: 'text-field',
                        name: 'authentication.password',
                        label: 'Token'
                    }
                ]
            }, {
                type: 'arn',
                name: 'ARN',
                fields: [
                    {
                        component: 'text-field',
                        name: 'authentication.password',
                        label: 'ARN'
                    }
                ]
            }],
            endpoint: {
                title: 'Configure OpenShift endpoint',
                fields: [
                    {
                        component: 'text-field',
                        name: 'endpoint.certificate_authority',
                        label: 'Certificate Authority'
                    }
                ]
            }
        }
    };

    describe('createGenericAuthTypeSelection', () => {
        it('generate single selection', () => {
            const fields = ONE_SINGLE_SELECTION_TYPE.schema.authentication[0].fields.filter(({ stepKey }) => !stepKey);

            expectedSchema = expect.objectContaining({
                fields: expect.arrayContaining(fields),
                title: expect.any(String),
                name: ONE_SINGLE_SELECTION_TYPE.name,
                nextStep: 'summary'
            });

            expect(createGenericAuthTypeSelection(ONE_SINGLE_SELECTION_TYPE, APPEND_ENDPOINT_FIELDS, NOT_EDITING)).toEqual(expectedSchema);
        });

        it('generate single selection with additional steps', () => {
            const ONE_SINGLE_SELECTION_TYPE_ADD_STEPS = {
                ...ONE_SINGLE_SELECTION_TYPE,
                name: 'openshiftAdditionalStep'
            };

            const EXPECTED_NEXTSTEP = `${ONE_SINGLE_SELECTION_TYPE_ADD_STEPS.name}-token-generic-additional-step`;

            const fields = ONE_SINGLE_SELECTION_TYPE_ADD_STEPS.schema.authentication[0].fields.filter(({ stepKey }) => !stepKey);

            expectedSchema = expect.objectContaining({
                fields: expect.arrayContaining(fields),
                title: expect.any(String),
                name: ONE_SINGLE_SELECTION_TYPE_ADD_STEPS.name,
                nextStep: EXPECTED_NEXTSTEP
            });

            expect(createGenericAuthTypeSelection(ONE_SINGLE_SELECTION_TYPE_ADD_STEPS, APPEND_ENDPOINT_FIELDS, NOT_EDITING)).toEqual(expectedSchema);
        });

        it('generate single selection with endpoint', () => {
            expectedSchema = expect.objectContaining({
                fields: expect.any(Array),
                title: expect.any(String),
                name: ONE_SINGLE_SELECTION_TYPE.name,
                nextStep: `${ONE_SINGLE_SELECTION_TYPE.name}-endpoint`
            });

            expect(createGenericAuthTypeSelection(ONE_SINGLE_SELECTION_TYPE, EMPTY_APPEND_ENDPOINT, NOT_EDITING)).toEqual(expectedSchema);
        });

        describe('generate multiple selection', () => {
            const firstTypeName = MULTIPLE_SELECTION_TYPE.schema.authentication[0].type;
            const secondTypeName = MULTIPLE_SELECTION_TYPE.schema.authentication[1].type;

            const firstAuth = expect.objectContaining({ component: 'auth-select', authName: firstTypeName });
            const secondAuth = expect.objectContaining({ component: 'auth-select', authName: secondTypeName });

            it('no endpoint', () => {
                expectedSchema = expect.objectContaining({
                    fields: expect.arrayContaining([
                        firstAuth,
                        secondAuth
                    ]),
                    title: expect.any(String),
                    name: MULTIPLE_SELECTION_TYPE.name,
                    nextStep: {
                        when: expect.any(String),
                        stepMapper: {
                            [firstTypeName]: 'summary',
                            [secondTypeName]: 'summary'
                        }
                    }
                });

                expect(createGenericAuthTypeSelection(MULTIPLE_SELECTION_TYPE, APPEND_ENDPOINT_FIELDS, NOT_EDITING)).toEqual(expectedSchema);
            });

            it('with endpoint', () => {
                const ENDPOINT_STEP_NAME = `${MULTIPLE_SELECTION_TYPE.name}-endpoint`;

                expectedSchema = expect.objectContaining({
                    fields: expect.arrayContaining([
                        firstAuth,
                        secondAuth
                    ]),
                    title: expect.any(String),
                    name: MULTIPLE_SELECTION_TYPE.name,
                    nextStep: {
                        when: expect.any(String),
                        stepMapper: {
                            [firstTypeName]: ENDPOINT_STEP_NAME,
                            [secondTypeName]: ENDPOINT_STEP_NAME
                        }
                    }
                });

                expect(createGenericAuthTypeSelection(MULTIPLE_SELECTION_TYPE, EMPTY_APPEND_ENDPOINT, NOT_EDITING)).toEqual(expectedSchema);
            });
        });
    });
});
