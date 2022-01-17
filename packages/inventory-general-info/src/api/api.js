import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
export const INVENTORY_API_BASE = '/api/inventory/v1';

import instance from '@redhat-cloud-services/frontend-components-utilities/interceptors';
import { HostsApi } from '@redhat-cloud-services/host-inventory-client';

export const hosts = new HostsApi(undefined, INVENTORY_API_BASE, instance);

export const getEntitySystemProfile = (item) => hosts.apiHostGetHostSystemProfileById([item]);
