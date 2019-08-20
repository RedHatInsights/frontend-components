/* eslint-disable camelcase */
export const testProperties = {
    number_of_cpus: 1,
    number_of_sockets: 1,
    cores_per_socket: 1,
    ramSize: '5 MB',
    disk_devices: []
};

export const osTest = {
    arch: 'test-arch',
    os_release: 'test-release',
    os_kernel_version: 'test-kernel',
    last_boot_time: 'test-boot',
    kernel_modules: []
};

export const biosTest = {
    bios_vendor: 'test-vendor',
    bios_version: 'test-version',
    bios_release_date: 1565702893431,
    cpu_flags: []
};

export const infraTest = {
    infrastructure_type: 'test-type',
    infrastructure_vendor: 'test-vendor',
    network: {
        ipv4: [ '1' ],
        ipv6: [ '6' ],
        interfaces: [ 'test' ]
    }
};

export const configTest = {
    installed_packages: [ 'packages' ],
    enabled_services: [ 'services' ],
    running_processes: [ 'processes' ],
    repositories: {
        enabled: [{
            base_url: 'test-url',
            name: 'test-name',
            enabled: true,
            gpgcheck: true
        }],
        disabled: []
    }
};

export const collectInfoTest = {
    insights_client_version: 'test-client',
    insights_egg_version: 'test-egg'
};
