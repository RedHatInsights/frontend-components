import { changeSystemCveStatus, fetchStatusList, getCveListBySystem } from '../api';
import { CHANGE_SYSTEM_CVE_STATUS, CVE_FETCH_LIST, SYSTEM_CVE_STATUS_LIST } from './action-types';

export const fetchCveListBySystem = apiProps => ({
    type: CVE_FETCH_LIST,
    meta: new Date(),
    payload: getCveListBySystem(apiProps)
});

export const fetchSystemCveStatusList = () => ({
    type: SYSTEM_CVE_STATUS_LIST,
    payload: fetchStatusList()
});

export const changeSystemCveStatusAction = (inventoryId, cve, statusId, callback) => ({
    type: CHANGE_SYSTEM_CVE_STATUS,
    payload: changeSystemCveStatus(inventoryId, cve, statusId, callback)
});
