import instance from '@redhat-cloud-services/frontend-components-utilities/files/interceptors';

export const cves = async (systemId) => {
    try {
        const [ low, moderate, important, critical ] = await Promise.all([{
            from: '0',
            to: '3.9'
        }, {
            from: '4',
            to: '7.9'
        }, {
            from: '8',
            to: '10'
        }].map(({ from, to }) => (
            instance.get(
                `/api/vulnerability//v1/systems/${
                    systemId
                }/cves?page=1&page_size=20&sort=-public_date&cvss_from=${
                    from
                }&cvss_to=${
                    to
                }`
            )
        )));
        return { low, moderate, important, critical };
    } catch (_e) {
        return {};
    }
};

export const patch = async (systemId) => {
    try {
        return await instance.get(`/api/patch/v1/systems/${systemId}`);
    } catch (_e) {
        return {};
    }
};

export const advisor = async (systemId) => {
    try {
        return await instance.get(`/api/insights/v1/system/${systemId}/reports/`);
    } catch (_e) {
        return {};
    }
};

export const compliance = async (systemId) => {
    const query = `query System($systemId: String!) {
        system(id: $systemId) {
            id
            name
            profiles {
                id
                name
                refId
                compliant
                rulesFailed
                rulesPassed
                lastScanned
                score
                __typename
            }
            __typename
        }
    }`;
    try {
        return await instance.post('/api/compliance/graphql', {
            operationName: 'System',
            query,
            variables: {
                systemId
            }
        });
    } catch (_e) {
        return {};
    }
};
