import { asyncValidator, asyncValidatorDebouncedWrapper, setFirstValidated } from '../../addSourceWizard/SourceAddSchema';
import * as actions from '../../api/index';

describe('asyncNameValidator', () => {
    const returnedSourceResponse = {
        data: {
            sources: [
                { id: '1', name: 'a1' }
            ]
        }
    };

    const emptySourceResponse = {
        data: { sources: [ ] }
    };

    const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };

    it('returns undefined when no value', async () => {
        expect.assertions(1);

        actions.findSource = jest.fn(() => Promise.resolve(returnedSourceResponse));

        const result = await asyncValidator(undefined, undefined, intl);

        expect(result).toEqual(undefined);
    });

    it('returns error message when name is taken', async () => {
        expect.assertions(1);

        actions.findSource = jest.fn(() => Promise.resolve(returnedSourceResponse));

        try {
            await asyncValidator('a1', undefined, intl);
        } catch (e) {
            expect(e).toEqual('That name is taken. Try another.');
        }
    });

    it('returns nothing when name is taken but by the same source', async () => {
        expect.assertions(1);

        actions.findSource = jest.fn(() => Promise.resolve(returnedSourceResponse));

        return asyncValidator('a1', '1', intl).then(data => expect(data).toEqual(undefined));
    });

    it('returns nothing when passes', async () => {
        actions.findSource = jest.fn(() => Promise.resolve(emptySourceResponse));

        const msg = await asyncValidator('a1', undefined, intl);

        expect(msg).toEqual(undefined);
    });

    it('returns nothing when the request fails', async () => {
        const consoleTmp = console.error;
        console.error = jest.fn();

        actions.findSource = jest.fn(() => Promise.reject('Some error'));

        const msg = await asyncValidator('a1', undefined, intl);

        expect(msg).toEqual(undefined);
        expect(console.error).toHaveBeenCalledWith('Some error');

        console.error = consoleTmp;
    });

    describe('wrapper', () => {
        beforeEach(() => {
            setFirstValidated(true);
        });

        it('do not return promise when value is empty and editing', () => {
            actions.findSource = jest.fn(() => Promise.resolve(emptySourceResponse));

            expect(asyncValidatorDebouncedWrapper(intl)(undefined, undefined, intl)).toEqual(undefined);

            expect(asyncValidatorDebouncedWrapper(intl)(undefined, undefined, intl)).toEqual(expect.any(Promise));
            expect(asyncValidatorDebouncedWrapper(intl)(undefined, undefined, intl)).toEqual(expect.any(Promise));
        });

        it('returns function when editing', () => {
            actions.findSource = jest.fn(() => Promise.resolve(emptySourceResponse));

            expect(asyncValidatorDebouncedWrapper(intl)('a1', '1', intl)).toEqual(expect.any(Promise));
            expect(asyncValidatorDebouncedWrapper(intl)('a1', '1', intl)).toEqual(expect.any(Promise));
        });
    });
});
