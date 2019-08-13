/* eslint-disable camelcase */
import {
    propertiesSelector,
    operatingSystem,
    biosSelector,
    infrastructureSelector,
    configurationSelector,
    collectionInformationSelector
} from './selectors';

it('propertiesSelector should return correct data', () => {
    expect(propertiesSelector({
        number_of_cpus: 1,
        number_of_sockets: 1,
        cores_per_socket: 1,
        ramSize: '5 MB',
        disk_devices: []
    })).toEqual({
        cpuNumber: 1,
        sockets: 1,
        coresPerSocket: 1,
        ramSize: '5 MB',
        storage: []
    });
});

it('propertiesSelector - no data', () => {
    expect(propertiesSelector()).toEqual({
        cpuNumber: undefined,
        sockets: undefined,
        coresPerSocket: undefined,
        ramSize: undefined,
        storage: undefined
    });
});

it('operatingSystem should return correct data', () => {
    expect(operatingSystem({
        arch: 'test-arch',
        os_release: 'test-release',
        os_kernel_version: 'test-kernel',
        last_boot_time: 'test-boot',
        kernel_modules: []
    })).toEqual({
        release: 'test-release',
        kernelRelease: 'test-kernel',
        architecture: 'test-arch',
        bootTime: 'test-boot',
        kernelModules: []
    });
});

it('operatingSystem - no data', () => {
    expect(operatingSystem()).toEqual({
        release: undefined,
        kernelRelease: undefined,
        architecture: undefined,
        bootTime: undefined,
        kernelModules: undefined
    });
});

it('biosSelector should return correct data', () => {
    expect(biosSelector({
        bios_vendor: 'test-vendor',
        bios_version: 'test-version',
        bios_release_date: 1565702893431,
        cpu_flags: []
    })).toEqual({
        vendor: 'test-vendor',
        version: 'test-version',
        releaseDate: '8/13/2019',
        csm: []
    });
});

it('biosSelector - no data', () => {
    expect(biosSelector()).toEqual({
        vendor: undefined,
        version: undefined,
        releaseDate: undefined,
        csm: undefined
    });
});

it('infrastructureSelector should return correct data', () => {
    expect(infrastructureSelector({
        infrastructure_type: 'test-type',
        infrastructure_vendor: 'test-vendor',
        network: {
            ipv4: [ '1' ],
            ipv6: [ '6' ],
            interfaces: [ 'test' ]
        }
    })).toEqual({
        type: 'test-type',
        vendor: 'test-vendor',
        ipv4: [ '1' ],
        ipv6: [ '6' ],
        nics: [ 'test' ]
    });
});

it('infrastructureSelector - no data', () => {
    expect(infrastructureSelector()).toEqual({
        type: undefined,
        vendor: undefined,
        ipv4: undefined,
        ipv6: undefined,
        nics: undefined
    });
});

it('configurationSelector should return correct data', () => {
    expect(configurationSelector({
        installed_packages: [ 'packages' ],
        enabled_services: [ 'services' ],
        running_processes: [ 'processes' ],
        repositories: [ 'repos' ]
    })).toEqual({
        packages: [ 'packages' ],
        services: [ 'services' ],
        processes: [ 'processes' ],
        repositories: [ 'repos' ]
    });
});

it('configurationSelector should return correct data', () => {
    expect(configurationSelector()).toEqual({
        packages: undefined,
        services: undefined,
        processes: undefined,
        repositories: undefined
    });
});

it('collectionInformationSelector should return correct data', () => {
    expect(collectionInformationSelector({
        insights_client_version: 'test-client',
        insights_egg_version: 'test-egg'
    })).toEqual({
        client: 'test-client',
        egg: 'test-egg'
    });
});

it('collectionInformationSelector - no data', () => {
    expect(collectionInformationSelector()).toEqual({
        client: undefined,
        egg: undefined
    });
});
