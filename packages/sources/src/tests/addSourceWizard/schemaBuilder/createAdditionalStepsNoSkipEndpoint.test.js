import { createAdditionalSteps } from '../../../addSourceWizard/schemaBuilder';

describe('createAdditionalSteps no skipEndpoint', () => {
    const ADDITIONAL_STEPS = [
        { name: 'step-1', fields: [ 'a' ] }
    ];

    const TYPES_FIELDS = [];

    it('assigns endpoint as a next step when has endpoint', () => {
        const HAS_ENDPOINT = true;

        const result = createAdditionalSteps(
            ADDITIONAL_STEPS,
            'red',
            'hat',
            HAS_ENDPOINT,
            TYPES_FIELDS
        );

        expect(result).toEqual([{
            ...ADDITIONAL_STEPS[0],
            stepKey: 'red-hat-generic-additional-step',
            nextStep: 'red-endpoint'
        }]);
    });

    it('assigns summary as a next step when has no endpoint', () => {
        const HAS_ENDPOINT = false;

        const result = createAdditionalSteps(
            ADDITIONAL_STEPS,
            'red',
            'hat',
            HAS_ENDPOINT,
            TYPES_FIELDS
        );

        expect(result).toEqual([{
            ...ADDITIONAL_STEPS[0],
            stepKey: 'red-hat-generic-additional-step',
            nextStep: 'summary'
        }]);
    });
});
