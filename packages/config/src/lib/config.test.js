import config from './createConfig';
import path from 'path';
const crdMockPath = path.resolve(__dirname, './crd-mock.yaml');

const configBuilder = (c) => config({ rootFolder: '', frontendCRDPath: crdMockPath, ...c });

describe('should create dummy config with no options', () => {
  const { mode, optimization, entry, output, devServer } = config({
    rootFolder: '',
    appEntry: '/foo/bar',
    appName: 'Fooapp',
    env: 'stage-stable',
    frontendCRDPath: crdMockPath,
  });

  const { mode: prodMode } = configBuilder({ mode: 'production' });
  test('mode', () => {
    expect(mode).toBe('development');
  });

  test('prodMode', () => {
    expect(prodMode).toBe('production');
  });

  test('optimization', () => {
    expect(optimization).toEqual(undefined);
  });

  test('entry', () => {
    expect(entry).toEqual({ App: '/foo/bar' });
  });

  test('output', () => {
    expect(output).toEqual({
      filename: expect.stringMatching(/js\/\[name\]\.\[contenthash\]\.js/),
      path: '/dist',
      chunkFilename: expect.stringMatching(/js\/\[name\]\.\[contenthash\]\.js/),
    });
  });

  test('devServer', () => {
    expect(devServer).toEqual({
      setupMiddlewares: expect.any(Function),
      onListening: expect.any(Function),
      static: {
        directory: '/dist',
      },
      server: 'http',
      host: '0.0.0.0',
      port: 8002,
      hot: false,
      liveReload: true,
      allowedHosts: 'all',
      historyApiFallback: {
        rewrites: [
          { from: /^\/api/, to: '/404.html' },
          { from: /^\/config/, to: '/404.html' },
        ],
        verbose: false,
        disableDotRule: true,
      },
      client: {
        overlay: false,
      },
      devMiddleware: {
        writeToDisk: true,
      },
    });
  });
});

describe('rootFolder', () => {
  const { output, devServer } = configBuilder({ rootFolder: '/some' });
  test('output', () => {
    expect(output.path).toBe('/some/dist');
  });

  test('devServer', () => {
    expect(devServer.static.directory).toBe('/some/dist');
  });
});

describe('module rules', () => {
  test('length', () => {
    const { module } = configBuilder({ appEntry: 'testEntry', appName: 'someName' });
    expect(module.rules.length).toBe(4);
  });
});

test('appEntry correctly set', () => {
  const { entry } = configBuilder({ appEntry: 'testEntry' });
  expect(entry).toEqual({ App: 'testEntry' });
});

describe('publicPath', () => {
  test('should ignore unknown public path', () => {
    const { output } = configBuilder({ publicPath: 'test-value' });
    expect(output.publicPath).toBe(undefined);
  });
  test('should propagate public path auto', () => {
    const { output } = configBuilder({ publicPath: 'auto' });
    expect(output.publicPath).toBe('auto');
  });
});

describe('port', () => {
  const { devServer } = configBuilder({ port: 1000 });

  test('devServer', () => {
    expect(devServer.port).toBe(1000);
  });
});

test('https', () => {
  const { devServer } = configBuilder({ https: true });
  // Without mkcert .pem files, falls back to 'https' string
  expect(devServer.server).toBe('https');
});

describe('mkcert certificate detection', () => {
  const fs = require('fs');
  const originalExistsSync = fs.existsSync;
  const originalReadFileSync = fs.readFileSync;

  afterEach(() => {
    fs.existsSync = originalExistsSync;
    fs.readFileSync = originalReadFileSync;
  });

  test('uses mkcert certs when .pem files exist in rootFolder', () => {
    const certContent = Buffer.from('mock-cert');
    const keyContent = Buffer.from('mock-key');
    fs.existsSync = jest.fn((filePath) => {
      if (filePath.includes('stage.foo.redhat.com.pem') || filePath.includes('stage.foo.redhat.com-key.pem')) {
        return true;
      }
      return originalExistsSync(filePath);
    });
    fs.readFileSync = jest.fn((filePath) => {
      if (filePath.includes('stage.foo.redhat.com-key.pem')) return keyContent;
      if (filePath.includes('stage.foo.redhat.com.pem')) return certContent;
      return originalReadFileSync(filePath);
    });

    const { devServer } = configBuilder({ https: true, rootFolder: '/app' });
    expect(devServer.server).toEqual({
      type: 'https',
      options: {
        cert: certContent,
        key: keyContent,
      },
    });
  });

  test('falls back to https string when .pem files are missing', () => {
    fs.existsSync = jest.fn((filePath) => {
      if (filePath.includes('stage.foo.redhat.com')) return false;
      return originalExistsSync(filePath);
    });

    const { devServer } = configBuilder({ https: true, rootFolder: '/app' });
    expect(devServer.server).toBe('https');
  });

  test('does not check for .pem files when server is http', () => {
    fs.existsSync = jest.fn((filePath) => {
      if (filePath.includes('stage.foo.redhat.com')) {
        throw new Error('Should not check for .pem files in http mode');
      }
      return originalExistsSync(filePath);
    });

    const { devServer } = configBuilder({ https: false, useProxy: false, rootFolder: '/app' });
    expect(devServer.server).toBe('http');
  });

  test('uses mkcert certs when useProxy is true', () => {
    const certContent = Buffer.from('mock-cert');
    const keyContent = Buffer.from('mock-key');
    fs.existsSync = jest.fn((filePath) => {
      if (filePath.includes('stage.foo.redhat.com.pem') || filePath.includes('stage.foo.redhat.com-key.pem')) {
        return true;
      }
      return originalExistsSync(filePath);
    });
    fs.readFileSync = jest.fn((filePath) => {
      if (filePath.includes('stage.foo.redhat.com-key.pem')) return keyContent;
      if (filePath.includes('stage.foo.redhat.com.pem')) return certContent;
      return originalReadFileSync(filePath);
    });

    const { devServer } = configBuilder({ useProxy: true, rootFolder: '/app' });
    expect(devServer.server).toEqual({
      type: 'https',
      options: {
        cert: certContent,
        key: keyContent,
      },
    });
  });
});

describe('mkcert certificate detection (integration - real filesystem)', () => {
  const fs = require('fs');
  const os = require('os');
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fec-config-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('loads real .pem files from rootFolder without mocks', () => {
    const certContent = 'test-certificate-content-for-integration-test';
    const keyContent = 'test-key-content-for-integration-test';
    fs.writeFileSync(path.join(tmpDir, 'stage.foo.redhat.com.pem'), certContent);
    fs.writeFileSync(path.join(tmpDir, 'stage.foo.redhat.com-key.pem'), keyContent);

    const { devServer } = config({
      rootFolder: tmpDir,
      https: true,
      frontendCRDPath: crdMockPath,
    });

    expect(devServer.server).toEqual({
      type: 'https',
      options: {
        cert: Buffer.from(certContent),
        key: Buffer.from(keyContent),
      },
    });
  });

  test('falls back to https string when no .pem files exist on disk', () => {
    const { devServer } = config({
      rootFolder: tmpDir,
      https: true,
      frontendCRDPath: crdMockPath,
    });

    expect(devServer.server).toBe('https');
  });

  test('requires both cert and key files (only cert present)', () => {
    const certContent = 'test-certificate-content-for-integration-test';
    fs.writeFileSync(path.join(tmpDir, 'stage.foo.redhat.com.pem'), certContent);
    // key file intentionally missing

    const { devServer } = config({
      rootFolder: tmpDir,
      https: true,
      frontendCRDPath: crdMockPath,
    });

    expect(devServer.server).toBe('https');
  });

  test('requires both cert and key files (only key present)', () => {
    const keyContent = 'test-key-content-for-integration-test';
    fs.writeFileSync(path.join(tmpDir, 'stage.foo.redhat.com-key.pem'), keyContent);
    // cert file intentionally missing

    const { devServer } = config({
      rootFolder: tmpDir,
      https: true,
      frontendCRDPath: crdMockPath,
    });

    expect(devServer.server).toBe('https');
  });

  test('loads real .pem files via useProxy path (implicit https)', () => {
    const certContent = 'test-certificate-content-for-integration-test';
    const keyContent = 'test-key-content-for-integration-test';
    fs.writeFileSync(path.join(tmpDir, 'stage.foo.redhat.com.pem'), certContent);
    fs.writeFileSync(path.join(tmpDir, 'stage.foo.redhat.com-key.pem'), keyContent);

    const { devServer } = config({
      rootFolder: tmpDir,
      useProxy: true,
      frontendCRDPath: crdMockPath,
    });

    expect(devServer.server).toEqual({
      type: 'https',
      options: {
        cert: Buffer.from(certContent),
        key: Buffer.from(keyContent),
      },
    });
  });

  test('does not attempt cert detection in http mode', () => {
    const certContent = 'test-certificate-content-for-integration-test';
    const keyContent = 'test-key-content-for-integration-test';
    fs.writeFileSync(path.join(tmpDir, 'stage.foo.redhat.com.pem'), certContent);
    fs.writeFileSync(path.join(tmpDir, 'stage.foo.redhat.com-key.pem'), keyContent);

    const { devServer } = config({
      rootFolder: tmpDir,
      https: false,
      useProxy: false,
      frontendCRDPath: crdMockPath,
    });

    expect(devServer.server).toBe('http');
  });
});

describe('custom sslCert/sslKey options', () => {
  const fs = require('fs');
  const os = require('os');
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fec-config-ssl-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('uses custom cert and key paths when sslCert/sslKey provided', () => {
    const certContent = 'custom-cert-content';
    const keyContent = 'custom-key-content';
    const certPath = path.join(tmpDir, 'my-cert.pem');
    const keyPath = path.join(tmpDir, 'my-key.pem');
    fs.writeFileSync(certPath, certContent);
    fs.writeFileSync(keyPath, keyContent);

    const { devServer } = config({
      rootFolder: '/nonexistent',
      https: true,
      sslCert: certPath,
      sslKey: keyPath,
      frontendCRDPath: crdMockPath,
    });

    expect(devServer.server).toEqual({
      type: 'https',
      options: {
        cert: Buffer.from(certContent),
        key: Buffer.from(keyContent),
      },
    });
  });

  test('falls back to https string when custom cert path does not exist', () => {
    const { devServer } = config({
      rootFolder: tmpDir,
      https: true,
      sslCert: '/nonexistent/cert.pem',
      sslKey: '/nonexistent/key.pem',
      frontendCRDPath: crdMockPath,
    });

    expect(devServer.server).toBe('https');
  });

  test('custom paths take priority over rootFolder auto-detection', () => {
    // Place default mkcert files in rootFolder
    fs.writeFileSync(path.join(tmpDir, 'stage.foo.redhat.com.pem'), 'auto-cert');
    fs.writeFileSync(path.join(tmpDir, 'stage.foo.redhat.com-key.pem'), 'auto-key');
    // Place custom certs elsewhere
    const customDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fec-custom-ssl-'));
    const certPath = path.join(customDir, 'custom.pem');
    const keyPath = path.join(customDir, 'custom-key.pem');
    fs.writeFileSync(certPath, 'custom-cert');
    fs.writeFileSync(keyPath, 'custom-key');

    const { devServer } = config({
      rootFolder: tmpDir,
      https: true,
      sslCert: certPath,
      sslKey: keyPath,
      frontendCRDPath: crdMockPath,
    });

    expect(devServer.server).toEqual({
      type: 'https',
      options: {
        cert: Buffer.from('custom-cert'),
        key: Buffer.from('custom-key'),
      },
    });

    fs.rmSync(customDir, { recursive: true, force: true });
  });

  test('custom paths work with useProxy', () => {
    const certContent = 'proxy-cert';
    const keyContent = 'proxy-key';
    const certPath = path.join(tmpDir, 'proxy-cert.pem');
    const keyPath = path.join(tmpDir, 'proxy-key.pem');
    fs.writeFileSync(certPath, certContent);
    fs.writeFileSync(keyPath, keyContent);

    const { devServer } = config({
      rootFolder: '/nonexistent',
      useProxy: true,
      sslCert: certPath,
      sslKey: keyPath,
      frontendCRDPath: crdMockPath,
    });

    expect(devServer.server).toEqual({
      type: 'https',
      options: {
        cert: Buffer.from(certContent),
        key: Buffer.from(keyContent),
      },
    });
  });
});

test('noFileHash', () => {
  const { output } = configBuilder({ useFileHash: false });
  expect(output.filename).toBe('js/[name].js');
});
