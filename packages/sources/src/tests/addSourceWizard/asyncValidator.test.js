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

    it('returns error message when name is taken', async () => {
        expect.assertions(1);

        actions.findSource = jest.fn(() => Promise.resolve(returnedSourceResponse));

        try {
            await asyncValidator('a1');
        } catch (e) {
            expect(e).toEqual('Name has already been taken');
        }
    });

    it('returns nothing when name is taken but by the same source', async () => {
        expect.assertions(1);

        actions.findSource = jest.fn(() => Promise.resolve(returnedSourceResponse));

        return asyncValidator('a1', '1').then(data => expect(data).toEqual(undefined));
    });

    it('returns nothing when passes', async () => {
        actions.findSource = jest.fn(() => Promise.resolve(emptySourceResponse));

        const msg = await asyncValidator('a1');

        expect(msg).toEqual(undefined);
    });

    it('returns nothing when the request fails', async () => {
        const consoleTmp = console.error;
        console.error = jest.fn();

        actions.findSource = jest.fn(() => Promise.reject('Some error'));

        const msg = await asyncValidator('a1');

        expect(msg).toEqual(undefined);
        expect(console.error).toHaveBeenCalledWith('Some error');

        console.error = consoleTmp;
    });

    describe('wrapper', () => {
        beforeEach(() => {
            setFirstValidated(true);
        });

        it('returns required and then the debounced function when creating', () => {
            actions.findSource = jest.fn(() => Promise.resolve(emptySourceResponse));

            expect(asyncValidatorDebouncedWrapper()()).toEqual('Required');

            expect(asyncValidatorDebouncedWrapper()()).toEqual(expect.any(Promise));
            expect(asyncValidatorDebouncedWrapper()()).toEqual(expect.any(Promise));
        });

        it('returns function when editing', () => {
            actions.findSource = jest.fn(() => Promise.resolve(emptySourceResponse));

            expect(asyncValidatorDebouncedWrapper()('a1', '1')).toEqual(expect.any(Promise));
            expect(asyncValidatorDebouncedWrapper()('a1', '1')).toEqual(expect.any(Promise));
        });
    });
});
