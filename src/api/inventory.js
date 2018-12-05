export const INVENTORY_API_BASE = '/r/insights/platform/inventory/api/v1/hosts';

/* eslint camelcase: off */
function buildMock(i) {
    return {
        id: `${i}`,
        canonical_facts: {
            machine_id: `${i}c1497de-0ec7-43bb-a8a6-35cabd59e0bf`
        },
        account: '000001',
        facts: [
            {
                facts: {
                    hostname: `server0${i}.redhat.com`,
                    machine_id: `${i}c1497de-0ec7-43bb-a8a6-35cabd59e0bf`,
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
                        utcoffset: '-0400'
                    }
                },
                namespace: 'inventory'
            }
        ],
        display_name: 'Red Hat Enterprise Linux 8'
    };
}

function mockData(id) {
    const mocked = Array.from({ length: 5 }).map((_v, i) => buildMock(i));
    return id !== undefined ? {
        count: 1,
        results: [ mocked[id] ]
    } : {
        count: 5,
        results: mocked
    };
}

const mapData = ({ results, ...data }) => ({
    ...data,
    results: results.map(({ facts, ...oneResult }) => ({
        ...oneResult,
        facts: facts.reduce((acc, curr) => ({
            ...acc,
            [curr.namespace]: curr.facts
        }), {})
    }))
});

export function getEntities(items, { base = INVENTORY_API_BASE }) {
    return fetch(`${base}${items.length !== 0 ? '/' + items : ''}`).then(r => {
        if (r.ok) {
            return r.json().then(mapData);
        }

        // TODO: remove me
        if (r.status === 404) {
            return mapData(mockData(items));
        }

        throw new Error(`Unexpected response code ${r.status}`);
    });
}
