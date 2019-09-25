/* eslint-disable camelcase */

function safeParser(toParse, key) {
    try {
        return JSON.parse(toParse);
    } catch {
        return { [key]: toParse };
    }
}

export const propertiesSelector = ({
    number_of_cpus,
    number_of_sockets,
    cores_per_socket,
    ramSize,
    disk_devices
} = {}) => ({
    cpuNumber: number_of_cpus,
    sockets: number_of_sockets,
    coresPerSocket: cores_per_socket,
    ramSize,
    storage: disk_devices && disk_devices.map(({ device, label, mount_point, options, type }) => ({
        ...device && safeParser(device, 'device'),
        label,
        ...mount_point && safeParser(mount_point, 'mountpoint'),
        ...options && safeParser(options, 'options'),
        ...type && safeParser(type, 'mounttype')
    })
    )
});

export const operatingSystem = ({
    arch,
    os_release,
    os_kernel_version,
    last_boot_time,
    kernel_modules
} = {}) => ({
    release: os_release,
    kernelRelease: os_kernel_version,
    architecture: arch,
    bootTime: last_boot_time,
    kernelModules: kernel_modules
});

export const biosSelector = ({
    bios_vendor,
    bios_version,
    bios_release_date,
    cpu_flags
} = {}) => ({
    vendor: bios_vendor,
    version: bios_version,
    releaseDate: bios_release_date && new Date(bios_release_date).toLocaleDateString(),
    csm: cpu_flags
});

export const infrastructureSelector = ({
    infrastructure_type,
    infrastructure_vendor,
    network = {}
} = {}) => ({
    type: infrastructure_type,
    vendor: infrastructure_vendor,
    ipv4: network.ipv4,
    ipv6: network.ipv6,
    nics: network.interfaces
});

export const configurationSelector = ({
    installed_packages,
    enabled_services,
    running_processes,
    repositories
} = {}) => ({
    packages: installed_packages,
    services: enabled_services,
    processes: running_processes,
    repositories
});

export const collectionInformationSelector = ({
    insights_client_version,
    insights_egg_version
} = {}) => ({
    client: insights_client_version,
    egg: insights_egg_version
});
