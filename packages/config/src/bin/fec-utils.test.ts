import fs from 'fs';
import path from 'path';
import { checkTsConfig } from './fec-utils';

describe('checkTsConfig', () => {
  const cwd = '/fake/project';
  let logger: jest.Mock;

  beforeEach(() => {
    logger = jest.fn();
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('does nothing when tsconfig.json does not exist', () => {
    checkTsConfig(cwd, logger);
    expect(logger).not.toHaveBeenCalled();
  });

  it('does not warn when jsx is react-jsx', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({ compilerOptions: { jsx: 'react-jsx' } }));
    checkTsConfig(cwd, logger);
    expect(logger).not.toHaveBeenCalled();
  });

  it('warns when jsx is react', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({ compilerOptions: { jsx: 'react' } }));
    checkTsConfig(cwd, logger);
    expect(logger).toHaveBeenCalled();
    expect(logger.mock.calls[0][1]).toContain('"jsx": "react"');
  });

  it('warns when jsx is not set', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({ compilerOptions: {} }));
    checkTsConfig(cwd, logger);
    expect(logger).toHaveBeenCalled();
    expect(logger.mock.calls[0][1]).toContain('"jsx": "<not set>"');
  });

  it('warns when compilerOptions is absent', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({}));
    checkTsConfig(cwd, logger);
    expect(logger).toHaveBeenCalled();
  });

  it('warns to verify jsx when extends is present without local jsx', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({ extends: '@some-preset/tsconfig' }));
    checkTsConfig(cwd, logger);
    expect(logger).toHaveBeenCalled();
    expect(logger.mock.calls[0][1]).toContain('"extends"');
    expect(logger.mock.calls[1][1]).toContain('"react-jsx"');
  });

  it('handles trailing commas in tsconfig.json', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue('{ "compilerOptions": { "jsx": "react-jsx", }, }');
    checkTsConfig(cwd, logger);
    expect(logger).not.toHaveBeenCalled();
  });

  it('warns when tsconfig.json cannot be parsed', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue('{ invalid json');
    checkTsConfig(cwd, logger);
    expect(logger).toHaveBeenCalled();
    expect(logger.mock.calls[0][1]).toContain('Could not parse tsconfig.json');
  });

  it('resolves tsconfig.json relative to the provided cwd', () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    checkTsConfig('/my/project', logger);
    expect(existsSyncSpy).toHaveBeenCalledWith(path.resolve('/my/project', 'tsconfig.json'));
  });
});
