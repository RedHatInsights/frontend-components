import * as api from '../../api/index';
import { handleError } from '../../api/handleError';

describe('handleError', () => {
    let spyDelete;
    let spyDeleteError;

    const URL = 'redhat.com/api/v1/sources';
    const DETAIL = 'auth id does not exist';
    const DETAIL_ERROR = 'remove endpoint is unavailable';
    const ERROR = {
        config: { url: URL },
        response: {
            data: {
                errors: [
                    { detail: DETAIL }
                ]
            }
        }
    };
    const DELETE_ERROR = {
        response: {
            data: {
                errors: [
                    { detail: DETAIL_ERROR }
                ]
            }
        }
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

        const result = await handleError(SOURCE_ID, ERROR);

        const someTextIsNotInError = [ DETAIL, URL ].some((text) => !result.includes(text));
        expect(spyDelete).toHaveBeenCalledWith(SOURCE_ID);
        expect(someTextIsNotInError).toEqual(false);
    });

    it('handles error when delete fails', async () => {
        api.getSourcesApi = jest.fn().mockReturnValue({
            deleteSource: spyDeleteError
        });

        const result = await handleError(SOURCE_ID, ERROR);

        const someTextIsNotInError = [ DETAIL, URL, DETAIL_ERROR ].some((text) => !result.includes(text));
        expect(spyDeleteError).toHaveBeenCalledWith(SOURCE_ID);
        expect(someTextIsNotInError).toEqual(false);
    });

    it('handles string error', async () => {
        const STRING_ERROR = 'Cosi 123445';

        api.getSourcesApi = jest.fn().mockReturnValue({
            deleteSource: spyDelete
        });

        const result = await handleError(SOURCE_ID, STRING_ERROR);

        expect(spyDelete).not.toHaveBeenCalled();
        expect(result).toEqual(STRING_ERROR);
    });

    it('handles undefined', async () => {
        api.getSourcesApi = jest.fn().mockReturnValue({
            deleteSource: spyDeleteError
        });

        const result = await handleError(SOURCE_ID, undefined);

        expect(spyDelete).not.toHaveBeenCalled();
        expect(result).toEqual(expect.any(String));
    });

    it('handles error with string response', async () => {
        const STRING = 'I am a string';
        const ERROR_WITH_STRING = {
            config: { url: URL },
            response: {
                data: STRING
            }
        };

        api.getSourcesApi = jest.fn().mockReturnValue({
            deleteSource: spyDelete
        });

        const result = await handleError(SOURCE_ID, ERROR_WITH_STRING);

        const someTextIsNotInError = [ STRING, URL ].some((text) => !result.includes(text));
        expect(spyDelete).toHaveBeenCalledWith(SOURCE_ID);
        expect(someTextIsNotInError).toEqual(false);
    });
});
