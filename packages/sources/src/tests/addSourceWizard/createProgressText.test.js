import createProgressText from '../../addSourceWizard/createProgressText';

describe('createProgressText', () => {
    let formData;
    let result;

    it('only source', () => {
        formData = {};

        result = [
            'Step 1: sending source data',
            'Completed'
        ];

        expect(createProgressText(formData)).toEqual(result);
    });

    it('source with endpoint', () => {
        formData = { endpoint: {} };

        result = [
            'Step 1: sending source data',
            'Step 2: sending endpoint data',
            'Step 3: sending authentication data',
            'Completed'
        ];

        expect(createProgressText(formData)).toEqual(result);
    });

    it('source with app', () => {
        formData = { application: { application_type_id: 1 } };

        result = [
            'Step 1: sending source data',
            'Step 2: sending application data',
            'Completed'
        ];

        expect(createProgressText(formData)).toEqual(result);
    });

    it('cost managament', () => {
        formData = { endpoint: {}, billing_source: {}, application: { application_type_id: 1 } };

        result = [
            'Step 1: sending source data',
            'Step 2: sending endpoint and application data',
            'Step 3: sending authentication data',
            'Step 4: sending cost management data and connecting authentication and application',
            'Completed'
        ];

        expect(createProgressText(formData)).toEqual(result);
    });

    it('application and auth', () => {
        formData = { endpoint: {}, application: { application_type_id: 1 } };

        result = [
            'Step 1: sending source data',
            'Step 2: sending endpoint and application data',
            'Step 3: sending authentication data',
            'Step 4: connecting authentication and application',
            'Completed'
        ];

        expect(createProgressText(formData)).toEqual(result);
    });
});
