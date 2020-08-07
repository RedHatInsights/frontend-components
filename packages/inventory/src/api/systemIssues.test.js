import { mock } from '../__mock__/systemIssues';
import { patch, advisor, compliance, cves } from './systemIssues';

describe('patch', () => {
    it('should perform get call', async () => {
        mock.onGet('/api/patch/v1/systems/test-id').replyOnce(200, 'test');
        const data = await patch('test-id');
        expect(data).toBe('test');
    });

    it('should not fail', async () => {
        mock.onGet('/api/patch/v1/systems/test-id').reply(500);
        const data = await patch('test-id');
        expect(data).toMatchObject({});
    });
});

describe('advisor', () => {
    it('should perform get call', async () => {
        mock.onGet('/api/insights/v1/system/test-id/reports/').replyOnce(200, 'test');
        const data = await advisor('test-id');
        expect(data).toBe('test');
    });

    it('should not fail', async () => {
        mock.onGet('/api/insights/v1/system/test-id/reports/').reply(500);
        const data = await advisor('test-id');
        expect(data).toMatchObject({});
    });
});

describe('cve', () => {
    it('should perform get call', async () => {
        mock.onGet('/api/vulnerability//v1/systems/test-id/cves?page=1&page_size=1&impact=2').replyOnce(200, 'low-test');
        mock.onGet('/api/vulnerability//v1/systems/test-id/cves?page=1&page_size=1&impact=4').replyOnce(200, 'moderate-test');
        mock.onGet('/api/vulnerability//v1/systems/test-id/cves?page=1&page_size=1&impact=5').replyOnce(200, 'important-test');
        mock.onGet('/api/vulnerability//v1/systems/test-id/cves?page=1&page_size=1&impact=7').replyOnce(200, 'critical-test');
        const { low, moderate, important, critical  } = await cves('test-id');
        expect(low).toBe('low-test');
        expect(moderate).toBe('moderate-test');
        expect(important).toBe('important-test');
        expect(critical).toBe('critical-test');
    });

    it('should not fail', async () => {
        mock.onGet('/api/vulnerability//v1/systems/test-id/cves?page=1&page_size=1&impact=2').reply(500);
        const data = await cves('test-id');
        expect(data).toMatchObject({});
    });
});

describe('compliance', () => {
    it('should perform post call', async () => {
        mock.onPost('/api/compliance/graphql').replyOnce(200, 'test');
        const data = await compliance('test-id');
        expect(data).toBe('test');
    });

    it('should not fail', async () => {
        mock.onPost('/api/compliance/graphql').reply(500);
        const data = await compliance('test-id');
        expect(data).toMatchObject({});
    });
});
