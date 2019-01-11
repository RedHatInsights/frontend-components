import { getCveListBySystem } from '../../api/vulnerabilities';
import { CVE_FETCH_LIST } from '../action-types';

export const fetchCveListBySystem = (apiProps) => ({
    type: CVE_FETCH_LIST,
    payload: getCveListBySystem(apiProps)
});
