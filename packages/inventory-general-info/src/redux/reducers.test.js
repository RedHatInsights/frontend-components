import { formatBytes, sizes, calculateRepos, calculateInterfaces, systemProfilePending, onSystemProfile } from './reducers';
import mockedData from '../__mock__/mockedData.json';

describe('formatBytes', () => {
  it('should return 0 B for empty values', () => {
    expect(formatBytes('a')).toBe('0 B');
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes()).toBe('0 B');
  });

  sizes.map((oneSize, key) => {
    it(`size ${oneSize}`, () => {
      const formatted = formatBytes(Number(511 + '0'.repeat(3 * key)));
      expect(formatted.substring(formatted.length - 2)).toBe(`${key === 0 ? ' ' : ''}${oneSize}`);
    });
  });
});

it('should calculate repos', () => {
  const repos = calculateRepos([
    {},
    {
      enabled: true,
    },
    {
      enabled: false,
    },
  ]);
  expect(repos.disabled.length).toBe(2);
  expect(repos.enabled.length).toBe(1);
});

it('should calculate NIC', () => {
  const interfaces = calculateInterfaces([
    {
      ipv4_addresses: ['1'], // eslint-disable-line camelcase
    },
    {
      ipv4_addresses: ['1'], // eslint-disable-line camelcase
      ipv6_addresses: ['1'], // eslint-disable-line camelcase
    },
    {
      ipv6_addresses: ['1'], // eslint-disable-line camelcase
    },
  ]);
  expect(interfaces.interfaces.length).toBe(3);
  expect(interfaces.ipv4.length).toBe(2);
  expect(interfaces.ipv6.length).toBe(2);
});

describe('systemProfilePending', () => {
  it('no state', () => {
    expect(systemProfilePending()).toEqual({
      systemProfile: {
        loaded: false,
      },
    });
  });

  it("should't rewrite state", () => {
    expect(
      systemProfilePending({
        test: 'data',
      })
    ).toEqual({
      test: 'data',
      systemProfile: {
        loaded: false,
      },
    });
  });
});

describe('onSystemProfile', () => {
  it('empty results', () => {
    expect(onSystemProfile(undefined, { payload: {} })).toEqual({
      systemProfile: {
        loaded: true,
        network: undefined,
        ramSize: undefined,
        repositories: undefined,
      },
    });
  });
  describe('correct data', () => {
    const {
      systemProfile: { network, repositories, ramSize, ...rest },
    } = onSystemProfile(undefined, { payload: mockedData });

    it('network', () => {
      expect(network.interfaces.length).toBe(1);
      expect(network.ipv4.length).toBe(1);
      expect(network.ipv6.length).toBe(1);
    });

    it('repositories', () => {
      expect(repositories.disabled.length).toBe(1);
      expect(repositories.enabled.length).toBe(0);
    });

    it('ramSize', () => {
      expect(ramSize).toBe('488.35 MB');
    });

    it('rest data should match', () => {
      expect(rest).toMatchSnapshot();
    });
  });
});
