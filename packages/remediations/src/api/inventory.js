import instance from '@redhat-cloud-services/frontend-components-utilities/interceptors';
import { HostsApi } from '@redhat-cloud-services/host-inventory-client';

export const INVENTORY_API_BASE = '/api/inventory/v1';
export const hosts = new HostsApi(undefined, INVENTORY_API_BASE, instance);

export function getHostsById(systems, { page, perPage }) {
    return hosts.apiHostGetHostById(systems, undefined, perPage, page)
    .then((response) => response);
}
