import * as api from '../../api/index';
import { handleError } from '../../api/handleError';

describe('handleError', () => {
    let spyDelete;
    let spyDeleteError;

    const DETAIL = 'auth id does not exist';
    const DETAIL_ERROR = 'remove endpoint is unavailable';
    const ERROR = {
        errors: [
            { detail: DETAIL }
        ]
    };
    const DELETE_ERROR = {
        errors: [
            { detail: DETAIL_ERROR }
        ]
    };
    const SOURCE_ID = '11111';

    beforeEach(() => {
        spyDelete = jest.fn().mockReturnValue(Promise.resolve('ok'));
        spyDeleteError = jest.fn().mockReturnValue(Promise.reject(DELETE_ERROR));
    });

    afterEach(() => {
        spyDelete.mockReset();
        spyDeleteError.mockReset();
    });

    it('handles error', async () => {
        api.getSourcesApi = jest.fn().mockReturnValue({
            deleteSource: spyDelete
        });

        const result = await handleError(ERROR, SOURCE_ID);

        expect(spyDelete).toHaveBeenCalledWith(SOURCE_ID);
        expect(result).toEqual(DETAIL);
    });

    it('handles nonsense error', async () => {
        const NONSENSE_ERROR = {
            blabla: [
                { text: 'lorem ipsum' }
            ]
        };

        const result = await handleError(NONSENSE_ERROR);

        expect(result).toEqual(JSON.stringify(NONSENSE_ERROR, null, 2));
    });

    it('handles error with no source ID provided', async () => {
        api.getSourcesApi = jest.fn().mockReturnValue({
            deleteSource: spyDelete
        });

        const result = await handleError(ERROR);

        const someTextIsNotInError = [ DETAIL ].some((text) => !result.includes(text));
        expect(spyDelete).not.toHaveBeenCalled();
        expect(someTextIsNotInError).toEqual(false);
    });

    it('handles error when delete fails', async () => {
        api.getSourcesApi = jest.fn().mockReturnValue({
            deleteSource: spyDeleteError
        });

        const result = await handleError(ERROR, SOURCE_ID);

        const someTextIsNotInError = [ DETAIL, DETAIL_ERROR ].some((text) => !result.includes(text));
        expect(spyDeleteError).toHaveBeenCalledWith(SOURCE_ID);
        expect(someTextIsNotInError).toEqual(false);
    });

    it('handles string error', async () => {
        const STRING_ERROR = 'Cosi 123445';

        api.getSourcesApi = jest.fn().mockReturnValue({
            deleteSource: spyDelete
        });

        const result = await handleError(STRING_ERROR, SOURCE_ID);

        expect(spyDelete).not.toHaveBeenCalled();
        expect(result).toEqual(STRING_ERROR);
    });

    it('handles undefined', async () => {
        api.getSourcesApi = jest.fn().mockReturnValue({
            deleteSource: spyDeleteError
        });

        const result = await handleError(undefined, SOURCE_ID);

        expect(spyDelete).not.toHaveBeenCalled();
        expect(result).toEqual(expect.any(String));
    });
});
