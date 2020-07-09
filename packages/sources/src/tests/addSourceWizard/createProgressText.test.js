import createProgressText from '../../addSourceWizard/createProgressText';

describe('createProgressText', () => {
    let formData;
    let result;
    let texts;

    it('only source', () => {
        formData = {};

        result = [
            'Step 1: sending source data',
            'Completed'
        ];

        texts = createProgressText(formData);

        result.forEach((text, index) => {
            expect(text).toEqual(texts[index].props.defaultMessage.replace('{step}', index + 1));
        });
    });

    it('source with endpoint', () => {
        formData = { endpoint: {} };

        result = [
            'Step 1: sending source data',
            'Step 2: sending endpoint data',
            'Step 3: sending authentication data',
            'Completed'
        ];

        texts = createProgressText(formData);

        result.forEach((text, index) => {
            expect(text).toEqual(texts[index].props.defaultMessage.replace('{step}', index + 1));
        });
    });

    it('source with app', () => {
        formData = { application: { application_type_id: 1 } };

        result = [
            'Step 1: sending source data',
            'Step 2: sending application data',
            'Completed'
        ];

        texts = createProgressText(formData);

        result.forEach((text, index) => {
            expect(text).toEqual(texts[index].props.defaultMessage.replace('{step}', index + 1));
        });
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

        texts = createProgressText(formData);

        result.forEach((text, index) => {
            expect(text).toEqual(texts[index].props.defaultMessage.replace('{step}', index + 1));
        });
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

        texts = createProgressText(formData);

        result.forEach((text, index) => {
            expect(text).toEqual(texts[index].props.defaultMessage.replace('{step}', index + 1));
        });
    });
});
