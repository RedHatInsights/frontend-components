/* eslint-disable camelcase */
import {
  propertiesSelector,
  operatingSystem,
  biosSelector,
  infrastructureSelector,
  configurationSelector,
  collectionInformationSelector,
} from './selectors';
import { testProperties, osTest, biosTest, infraTest, configTest, collectInfoTest } from '../__mock__/selectors';

it('propertiesSelector should return correct data', () => {
  expect(propertiesSelector(testProperties)).toEqual({
    cpuNumber: 1,
    sockets: 1,
    coresPerSocket: 1,
    ramSize: '5 MB',
    storage: [],
    cpuFlags: [],
  });
});

it('propertiesSelector - no data', () => {
  expect(propertiesSelector()).toEqual({
    cpuNumber: undefined,
    sockets: undefined,
    coresPerSocket: undefined,
    ramSize: undefined,
    storage: undefined,
  });
});

it('operatingSystem should return correct data', () => {
  expect(operatingSystem(osTest)).toEqual({
    release: 'test-release',
    kernelRelease: 'test-kernel',
    architecture: 'test-arch',
    bootTime: 'test-boot',
    kernelModules: [],
  });
});

it('operatingSystem - no data', () => {
  expect(operatingSystem()).toEqual({
    release: undefined,
    kernelRelease: undefined,
    architecture: undefined,
    bootTime: undefined,
    kernelModules: undefined,
  });
});

it('biosSelector should return correct data', () => {
  expect(biosSelector(biosTest)).toEqual({
    vendor: 'test-vendor',
    version: 'test-version',
    releaseDate: '04/01/2014',
  });
});

it('biosSelector - no data', () => {
  expect(biosSelector()).toEqual({
    vendor: undefined,
    version: undefined,
    releaseDate: undefined,
  });
});

it('infrastructureSelector should return correct data', () => {
  expect(infrastructureSelector(infraTest)).toEqual({
    type: 'test-type',
    vendor: 'test-vendor',
    ipv4: ['1'],
    ipv6: ['6'],
    nics: ['test'],
  });
});

it('infrastructureSelector - no data', () => {
  expect(infrastructureSelector()).toEqual({
    type: undefined,
    vendor: undefined,
    ipv4: undefined,
    ipv6: undefined,
    nics: undefined,
  });
});

it('configurationSelector should return correct data', () => {
  expect(configurationSelector(configTest)).toEqual({
    packages: ['packages'],
    services: ['services'],
    processes: ['processes'],
    repositories: {
      disabled: [],
      enabled: [
        {
          base_url: 'test-url',
          name: 'test-name',
          enabled: true,
          gpgcheck: true,
        },
      ],
    },
  });
});

it('configurationSelector should return correct data', () => {
  expect(configurationSelector()).toEqual({
    packages: undefined,
    services: undefined,
    processes: undefined,
    repositories: undefined,
  });
});

it('collectionInformationSelector should return correct data', () => {
  expect(collectionInformationSelector(collectInfoTest)).toEqual({
    client: 'test-client',
    egg: 'test-egg',
  });
});

it('collectionInformationSelector - no data', () => {
  expect(collectionInformationSelector()).toEqual({
    client: undefined,
    egg: undefined,
  });
});
