export const remediationsResponse = {
    'ssg:rhel7|pci-dss|xccdf_org.ssgproject.content_rule_docker_storage_configured': false,
    'ssg:rhel7|pci-dss|xccdf_org.ssgproject.content_rule_service_docker_enabled': false
};

export const system = {
    id: 'aa9c4497-5707-4233-9e9b-1fded5423ef3',
    name: '3.example.com',
    profiles: {},
    __typename: 'System'
};

export const profileRules = [
    {
        system: 'aa9c4497-5707-4233-9e9b-1fded5423ef3',
        profile: {
            refId: 'xccdf_org.ssgproject.content_profile_pci-dss',
            name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7'
        },
        rules: [
            {
                title: 'Use direct-lvm with the Device Mapper Storage Driver',
                severity: 'low',
                rationale: 'foorationale',
                refId: 'xccdf_org.ssgproject.content_rule_docker_storage_configured',
                description: 'foodescription',
                compliant: true,
                identifier: {
                    label: 'CCE-80441-9',
                    system: 'https://nvd.nist.gov/cce/index.cfm',
                    __typename: 'RuleIdentifier'
                },
                references: [],
                __typename: 'Rule'
            },
            {
                title: 'Enable the Docker service',
                severity: 'medium',
                rationale: 'foorationale',
                refId: 'xccdf_org.ssgproject.content_rule_service_docker_enabled',
                description: 'foodescription',
                compliant: true,
                identifier: {
                    label: 'CCE-80440-1',
                    system: 'https://nvd.nist.gov/cce/index.cfm',
                    __typename: 'RuleIdentifier'
                },
                references: [],
                __typename: 'Rule'
            }
        ]
    }
];

