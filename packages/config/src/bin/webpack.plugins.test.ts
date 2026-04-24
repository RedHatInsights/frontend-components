jest.mock('@redhat-cloud-services/frontend-components-config-utilities', () => ({
  LogType: { warn: 'warn' },
  fecLogger: jest.fn(),
  federatedModules: jest.fn((config) => config),
  generatePFSharedAssetsList: jest.fn(() => ({})),
}));

// Mock fec.config.js require
const mockFecConfig = {
  appUrl: '/test',
  moduleFederation: {
    exposes: { './RootApp': './src/entry.tsx' }
  }
};

describe('webpack.plugins FEC_STATIC env var handling', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    process.env.FEC_ROOT_DIR = '/fake/root';
    process.env.FEC_CONFIG_PATH = '/fake/fec.config.js';

    // Mock the fec.config.js require
    jest.mock('/fake/fec.config.js', () => mockFecConfig, { virtual: true });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('sets useFileHash: true when NODE_ENV=production and FEC_STATIC not set', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.FEC_STATIC;

    require('./webpack.plugins');
    const { federatedModules } = require('@redhat-cloud-services/frontend-components-config-utilities');

    expect(federatedModules).toHaveBeenCalledWith(
      expect.objectContaining({
        useFileHash: true,
      })
    );
  });

  it('sets useFileHash: false when FEC_STATIC=true', () => {
    process.env.FEC_STATIC = 'true';
    process.env.NODE_ENV = 'production';

    require('./webpack.plugins');
    const { federatedModules } = require('@redhat-cloud-services/frontend-components-config-utilities');

    expect(federatedModules).toHaveBeenCalledWith(
      expect.objectContaining({
        useFileHash: false,
      })
    );
  });

  it('sets useFileHash: true when FEC_STATIC=false (string)', () => {
    process.env.FEC_STATIC = 'false';
    process.env.NODE_ENV = 'production';

    require('./webpack.plugins');
    const { federatedModules } = require('@redhat-cloud-services/frontend-components-config-utilities');

    expect(federatedModules).toHaveBeenCalledWith(
      expect.objectContaining({
        useFileHash: true,
      })
    );
  });

  it('sets useFileHash: false when NODE_ENV=production but FEC_STATIC=true overrides', () => {
    process.env.NODE_ENV = 'production';
    process.env.FEC_STATIC = 'true';

    require('./webpack.plugins');
    const { federatedModules } = require('@redhat-cloud-services/frontend-components-config-utilities');

    expect(federatedModules).toHaveBeenCalledWith(
      expect.objectContaining({
        useFileHash: false,
      })
    );
  });

  it('sets useFileHash: false when FEC_STATIC=TRUE (uppercase)', () => {
    process.env.NODE_ENV = 'production';
    process.env.FEC_STATIC = 'TRUE';

    require('./webpack.plugins');
    const { federatedModules } = require('@redhat-cloud-services/frontend-components-config-utilities');

    expect(federatedModules).toHaveBeenCalledWith(
      expect.objectContaining({
        useFileHash: false,
      })
    );
  });

  it('sets useFileHash: true when FEC_STATIC is empty string', () => {
    process.env.NODE_ENV = 'production';
    process.env.FEC_STATIC = '';

    require('./webpack.plugins');
    const { federatedModules } = require('@redhat-cloud-services/frontend-components-config-utilities');

    expect(federatedModules).toHaveBeenCalledWith(
      expect.objectContaining({
        useFileHash: true,
      })
    );
  });

  it('sets useFileHash: false when NODE_ENV not production and FEC_STATIC not set', () => {
    process.env.NODE_ENV = 'development';
    delete process.env.FEC_STATIC;

    require('./webpack.plugins');
    const { federatedModules } = require('@redhat-cloud-services/frontend-components-config-utilities');

    expect(federatedModules).toHaveBeenCalledWith(
      expect.objectContaining({
        useFileHash: false,
      })
    );
  });
});
