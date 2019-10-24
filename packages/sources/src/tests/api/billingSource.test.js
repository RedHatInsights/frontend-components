import * as api from '../../api/index';
import { postBillingSource } from '../../api/billingSource';
import { COST_MANAGEMENT_API_BASE } from '../../api/constants';

describe('postBillingSource - api', () => {
    let spyPost;

    const DATA = { source_id: '1', billing: { bucket: 'cost-usage-bucket' } };
    const URL = `${COST_MANAGEMENT_API_BASE}/sources/billing_source/`;
    const TIMEOUT = 100;
    const INTERVAL = 10;

    afterEach(() => {
        spyPost.mockReset();
    });

    it('pools until correct response', (done) => {
        spyPost = jest.fn()
        .mockImplementationOnce(() => Promise.reject('error'))
        .mockImplementationOnce(() => Promise.reject('error'))
        .mockImplementationOnce(() => Promise.resolve('ok'));

        api.axiosInstance = {
            post: spyPost
        };

        const COUNT_OF_CALLS = 3;

        postBillingSource(DATA, TIMEOUT, INTERVAL).then(() => {
            expect(spyPost.mock.calls.length).toEqual(COUNT_OF_CALLS);

            expect(spyPost.mock.calls[0][0]).toEqual(URL);
            expect(spyPost.mock.calls[1][0]).toEqual(URL);
            expect(spyPost.mock.calls[2][0]).toEqual(URL);

            expect(spyPost.mock.calls[0][1]).toEqual(DATA);
            expect(spyPost.mock.calls[1][1]).toEqual(DATA);
            expect(spyPost.mock.calls[2][1]).toEqual(DATA);

            done();
        }).catch(() => done.fail(new Error('Should not be here')));
    });

    it('pools until timeout', (done) => {
        spyPost = jest.fn().mockImplementation(() => Promise.reject('error'));

        api.axiosInstance = {
            post: spyPost
        };

        const INITIAL_REQUEST = 1;
        const COUNT_OF_CALLS = TIMEOUT / INTERVAL + INITIAL_REQUEST;

        postBillingSource(DATA, TIMEOUT, INTERVAL).catch(() => {
            expect(spyPost.mock.calls.length).toEqual(COUNT_OF_CALLS);
            expect(spyPost.mock.calls[0][0]).toEqual(URL);
            expect(spyPost.mock.calls[0][1]).toEqual(DATA);

            done();
        });
    });
});
