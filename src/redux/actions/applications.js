import { getCveListBySystem, fetchStatusList } from '../../api/vulnerabilities';
import { CVE_FETCH_LIST, SYSTEM_CVE_STATUS_LIST } from '../action-types';

export const fetchCveListBySystem = apiProps => ({
    type: CVE_FETCH_LIST,
    payload: getCveListBySystem(apiProps)
});

export const fetchSystemCveStatusList = () => ({
    type: SYSTEM_CVE_STATUS_LIST,
    payload: fetchStatusList()
});
