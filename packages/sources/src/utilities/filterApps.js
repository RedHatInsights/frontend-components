export const TOPOLOGY_INV_NAME = '/insights/platform/topological-inventory';

const filterApps = (type) => type.name !== TOPOLOGY_INV_NAME;

export default filterApps;
