export const computeSourceStatus = source => {
    const appStatus = source.applications?.[0]?.availability_status;
    const endpointStatus = source.endpoint?.[0]?.availability_status;
    const statuses = [ appStatus, endpointStatus ];

    if (statuses.includes('unavailable')) {
        return 'unavailable';
    }

    if (
        (appStatus === 'available' && !source.endpoint?.[0])
        || (endpointStatus === 'available' && !source.applications?.[0])
        || (appStatus === 'available' && endpointStatus === 'available')
    ) {
        return 'available';
    }

    if (source.applications?.[0] || source.endpoint?.[0]) {
        return 'timeout';
    }

    return 'finished';
};

export default computeSourceStatus;
