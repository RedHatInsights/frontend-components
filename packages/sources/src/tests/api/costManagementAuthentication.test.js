import * as api from '../../api/index';
import { COST_MANAGEMENT_API_BASE } from '../../api/constants';
import { patchSource } from '../../api/costManagementAuthentication';

describe('patch cost management source', () => {
    let spyGet = jest.fn();
    let spyPatch = jest.fn();

    const TIMEOUT = 100;
    const INTERVAL = 11;
    const ID = '10';
    const URL = `${COST_MANAGEMENT_API_BASE}/sources/${ID}/`;
    const CRED = 'MY_CRED';
    const RSRC_GRP = 'rg';
    const STRG_CNT = 'sa';
    const DATA = {
        authentication: { credentials: CRED },
        billing_source: { resource_group: RSRC_GRP, storage_account: STRG_CNT }
    };

    afterEach(() => {
        spyGet.mockReset();
        spyPatch.mockReset();
    });

    it('resolve', done => {
        expect.assertions(4);

        spyGet = jest.fn(() => Promise.resolve('OK1'));
        spyPatch = jest.fn(() => Promise.resolve('OK2'));
        api.axiosInstance = {
            get: spyGet,
            patch: spyPatch
        };

        patchSource({ id: ID, ...DATA }, TIMEOUT, INTERVAL).then(() => {
            expect(spyGet.mock.calls.length).toBe(1);
            expect(spyPatch.mock.calls.length).toBe(1);
            expect(spyGet.mock.calls[0]).toEqual([ URL ]);
            expect(spyPatch.mock.calls[0]).toEqual([ URL, DATA ]);
            done();
        }).catch((err) => done.fail(new Error(`should not be here: ${err}`)));
    });
    it('reject on check', done => {
        expect.assertions(2);

        spyGet = jest.fn(() => Promise.reject('NO'));
        spyPatch = jest.fn(() => Promise.resolve('OK'));
        api.axiosInstance = {
            get: spyGet,
            patch: spyPatch
        };

        patchSource({ id: ID, ...DATA }, TIMEOUT, INTERVAL)
        .catch(err => {
            expect(spyGet.mock.calls.length).toBeGreaterThan(1);
            expect(spyPatch.mock.calls.length).toBe(0);
            done();
        });
    });

    it('reject on update', done => {
        expect.assertions(2);

        spyGet = jest.fn(() => Promise.resolve('OK'));
        spyPatch = jest.fn(() => Promise.reject('NO'));
        api.axiosInstance = {
            get: spyGet,
            patch: spyPatch
        };

        patchSource({ id: ID, ...DATA })
        .catch(err => {
            expect(spyGet.mock.calls.length).toBe(1);
            expect(spyPatch.mock.calls.length).toBe(1);
            done();
        });
    });

    it('two failures on checking', done => {
        expect.assertions(2);

        spyGet = jest.fn()
        .mockImplementationOnce(() => Promise.reject('error'))
        .mockImplementationOnce(() => Promise.reject('error'))
        .mockImplementationOnce(() => Promise.resolve('ok'));
        spyPatch = jest.fn(() => Promise.resolve('ok'));
        api.axiosInstance = {
            get: spyGet,
            patch: spyPatch
        };

        patchSource({ id: ID, ...DATA }, TIMEOUT, INTERVAL)
        .then(() => {
            expect(spyGet.mock.calls.length).toBe(3);
            expect(spyPatch.mock.calls.length).toBe(1);
            done();
        })
        .catch(err => done.fail(`should not be here: ${err}`));
    });
});
