import { axiosInstance } from './index';

export const getSubWatchConfig = () => axiosInstance.get('/api/cloudigrade/v2/sysconfig/');
