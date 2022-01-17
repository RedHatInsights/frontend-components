import { systemProfile, editDisplayName, editAnsibleHost } from './actions';
import { mock } from '../__mock__/hostApi';
import mockedData from '../__mock__/mockedData.json';

describe('systemProfile', () => {
  it('should return correct redux action', async () => {
    mock.onGet('/api/inventory/v1/hosts/4/system_profile').reply(200, mockedData);
    const { type, payload } = systemProfile('4');
    expect(type).toBe('LOAD_SYSTEM_PROFILE');
    expect(await payload).toEqual(mockedData);
  });
});

describe('editDisplayName', () => {
  it('should call correct endpoint', async () => {
    mock.onPatch('/api/inventory/v1/hosts/4').reply(({ data }) => {
      expect(data).toEqual(JSON.stringify({ display_name: 'test-value' })); // eslint-disable-line camelcase
      return [200, mockedData];
    });
    const { type, meta } = await editDisplayName('4', 'test-value');
    expect(type).toBe('SET_DISPLAY_NAME');
    expect(meta).toEqual({
      notifications: {
        fulfilled: {
          variant: 'success',
          title: 'Display name has been updated',
          dismissable: true,
        },
      },
    });
  });
});

describe('editAnsibleHost', () => {
  it('should call correct endpoint', async () => {
    mock.onPatch('/api/inventory/v1/hosts/4').reply(({ data }) => {
      expect(data).toEqual(JSON.stringify({ ansible_host: 'test-value' })); // eslint-disable-line camelcase
      return [200, mockedData];
    });
    const { type, meta } = await editAnsibleHost('4', 'test-value');
    expect(type).toBe('SET_ANSIBLE_HOST');
    expect(meta).toEqual({
      notifications: {
        fulfilled: {
          variant: 'success',
          title: 'Ansible hostname has been updated',
          dismissable: true,
        },
      },
    });
  });
});
