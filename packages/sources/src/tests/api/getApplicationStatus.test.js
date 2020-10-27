import * as api from '../../api/index';
import { checkAppAvailability } from '../../api/getApplicationStatus';

describe('patch cost management source', () => {
    let getApplication;

    const TIMEOUT = 100;
    const INTERVAL = 11;
    const ID = '10';

    it('resolve available', async () => {
        getApplication = jest.fn(() => Promise.resolve({ availability_status: 'available' }));

        api.getSourcesApi = () => ({
            getApplication
        });

        await checkAppAvailability(ID, TIMEOUT, INTERVAL);

        expect(getApplication).toHaveBeenCalledWith(ID);
    });

    it('resolve unavailable', async () => {
        getApplication = jest.fn(() => Promise.resolve({ availability_status: 'unavailable' }));

        api.getSourcesApi = () => ({
            getApplication
        });

        await checkAppAvailability(ID, TIMEOUT, INTERVAL);

        expect(getApplication).toHaveBeenCalledWith(ID);
    });

    it('resolve timeout', async () => {
        getApplication = jest.fn(() => Promise.resolve({ availability_status: null }));

        api.getSourcesApi = () => ({
            getApplication
        });

        await checkAppAvailability(ID, TIMEOUT, INTERVAL);

        expect(getApplication).toHaveBeenCalledWith(ID);
    });

    it('resolve error', async () => {
        expect.assertions(1);

        const ERROR = { some: 'error' };

        getApplication = jest.fn(() => Promise.reject(ERROR));

        api.getSourcesApi = () => ({
            getApplication
        });

        try {
            await checkAppAvailability(ID, TIMEOUT, INTERVAL);
        } catch (e) {
            expect(e).toEqual(ERROR);
        }
    });

    it('two checks', async () => {
        getApplication = jest.fn()
        .mockImplementationOnce(() => Promise.resolve({ availability_status: null }))
        .mockImplementationOnce(() => Promise.resolve({ availability_status: null }))
        .mockImplementationOnce(() => Promise.resolve({ availability_status: 'available' }));

        api.getSourcesApi = () => ({
            getApplication
        });

        await checkAppAvailability(ID, TIMEOUT, INTERVAL);

        expect(getApplication.mock.calls.length).toBe(3);
    });

    it('with updated time', async () => {
        const UPDATED_TIME = new Date();
        const ENTITY = 'getApplication';

        getApplication = jest.fn()
        .mockImplementationOnce(() => Promise.resolve({ availability_status: 'available', updated_at: UPDATED_TIME }))
        .mockImplementationOnce(() => Promise.resolve({ availability_status: 'available', updated_at: UPDATED_TIME }))
        .mockImplementationOnce(() => Promise.resolve({ availability_status: 'available', updated_at: new Date(Number(UPDATED_TIME) + 1000) }));

        api.getSourcesApi = () => ({
            getApplication
        });

        await checkAppAvailability(ID, TIMEOUT, INTERVAL, ENTITY, UPDATED_TIME);

        expect(getApplication.mock.calls.length).toBe(3);
    });

    it('with updated time - with last_checked_at', async () => {
        const UPDATED_TIME = new Date();
        const ENTITY = 'getApplication';

        getApplication = jest.fn()
        .mockImplementationOnce(() => Promise.resolve({ availability_status: 'available', updated_at: UPDATED_TIME }))
        .mockImplementationOnce(() => Promise.resolve({ availability_status: 'available', updated_at: UPDATED_TIME }))
        .mockImplementationOnce(() => Promise.resolve({ availability_status: 'available', updated_at: UPDATED_TIME, last_checked_at: new Date(Number(UPDATED_TIME) + 1000) }));

        api.getSourcesApi = () => ({
            getApplication
        });

        await checkAppAvailability(ID, TIMEOUT, INTERVAL, ENTITY, UPDATED_TIME);

        expect(getApplication.mock.calls.length).toBe(3);
    });

    it('timeouts with updated time', async () => {
        const UPDATED_TIME = new Date();
        const ENTITY = 'getApplication';

        getApplication = jest.fn()
        .mockImplementation(() => Promise.resolve({ availability_status: 'available', updated_at: UPDATED_TIME }));

        api.getSourcesApi = () => ({
            getApplication
        });

        const result = await checkAppAvailability(ID, TIMEOUT, INTERVAL, ENTITY, UPDATED_TIME);

        expect(result.availability_status).toEqual(null);
    });
});
