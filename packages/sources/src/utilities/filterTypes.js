import { CLOUD_VENDOR, getActiveVendor, REDHAT_VENDOR } from './stringConstants';

const filterTypes = (type) => type.schema?.authentication && type.schema?.endpoint;

export const filterVendorTypes = ({ vendor }) => getActiveVendor() === CLOUD_VENDOR ? vendor !== REDHAT_VENDOR : vendor === REDHAT_VENDOR;

export default filterTypes;
