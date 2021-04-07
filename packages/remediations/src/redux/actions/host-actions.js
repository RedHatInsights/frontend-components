import * as HostHelper from '../../api/inventory';;
import { FETCH_SELECTED_HOSTS } from '../action-types';

export const fetchHostsById = (systems, options = {}) => ({
    type: FETCH_SELECTED_HOSTS,
    payload: HostHelper.getHostsById(systems, options)
});
