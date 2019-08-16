import { getEntitySystemProfile } from './index';
import { mock } from '../__mock__/hostApi';
import mockedData from '../__mock__/mockedData.json';

it('should send the data as JSON', async () => {
    mock.onGet('/api/inventory/v1/hosts/4/system_profile').reply(200, mockedData);

    const data = await getEntitySystemProfile('4');

    expect(mock.history.get.length).toBe(1);
    expect(data).toEqual(mockedData);
});

it('should throw 404', async () => {
    try {
        await getEntitySystemProfile();
    } catch (e) {
        expect(e.response.status).toBe(404);
    }
});
