import { CLOUD_VENDOR, getActiveVendor, REDHAT_VENDOR } from './stringConstants';

const filterTypes = (type) => type.schema?.authentication && type.schema?.endpoint;

export const filterVendorTypes = ({ vendor, name }) => getActiveVendor() === CLOUD_VENDOR
    ? vendor !== REDHAT_VENDOR
    : (vendor === REDHAT_VENDOR && name !== 'satellite');

export default filterTypes;
