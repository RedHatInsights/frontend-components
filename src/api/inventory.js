export const INVENTORY_API_BASE = '/entities';

/* eslint camelcase: off */
function buildMock(i) {
    return {
        id: i,
        canonical_facts: {
            'machine-id': `${i}c1497de-0ec7-43bb-a8a6-35cabd59e0bf`
        },
        account: '000001',
        facts: {
            release: 'Red Hat Enterprise Linux Server release 7.5 (Maipo)',
            rhel_version: '7.5',
            host_system_id: '6c1497de-0ec7-43bb-a8a6-35cabd59e0bf',
            bios_information: {
                vendor: 'SeaBIOS',
                version: '1.10.2-3.el7_4.1',
                release_date: '04/01/2014',
                bios_revision: '0.0'
            },
            system_information: {
                family: 'Red Hat Enterprise Linux',
                manufacturer: 'Red Hat',
                product_name: 'RHEV Hypervisor',
                virtual_machine: true
            },
            listening_processes: [],
            timezone_information: {
                timezone: 'EDT',
                utcoffset: '-14400'
            }
        },
        display_name: `server0${i}.redhat.com`
    };
}

function mockData(id) {
    const mocked = Array.from({ length: 5 }).map((_v, i) => buildMock(i));
    return id !== undefined ? mocked[0] : mocked;
}

export function getEntities () {
    return fetch(INVENTORY_API_BASE).then(r => {
        if (r.ok) {
            return r.json();
        }

        // TODO: remove me
        if (r.status === 404) {
            return mockData();
        }

        throw new Error(`Unexpected response code ${r.status}`);
    });
}

export function getEntity (id) {
    return fetch(`${INVENTORY_API_BASE}/${id}`).then(r => {
        if (r.ok) {
            return r.json();
        }

        // TODO: remove me
        if (r.status === 404) {
            return mockData(id);
        }

        throw new Error(`Unexpected response code ${r.status}`);
    });
}
