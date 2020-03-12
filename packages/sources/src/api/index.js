import axiosInstanceInsights from '@redhat-cloud-services/frontend-components-utilities/files/interceptors';

import { SOURCES_API_BASE, SOURCES_API_BASE_V2 } from './constants';

const axiosInstance = axiosInstanceInsights;

export { axiosInstance };

export const getSourcesApi = () => ({
    createEndpoint: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE}/endpoints`, data),
    createAuthentication: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE}/authentications`, data),
    deleteSource: (id) => axiosInstanceInsights.delete(`${SOURCES_API_BASE}/sources/${id}`),
    createApplication: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE}/applications`, data),
    postGraphQL: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE}/graphql`, data),
    listSourceTypes: () => axiosInstanceInsights.get(`${SOURCES_API_BASE}/source_types`),
    listApplicationTypes: () => axiosInstanceInsights.get(`${SOURCES_API_BASE}/application_types`),
    createSource: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE}/sources`, data),
    createAuthApp: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE_V2}/application_authentications`, data)
});

export const doLoadSourceTypes = () =>
    getSourcesApi().listSourceTypes().then(data => ({ sourceTypes: data.data }));

export const doLoadApplicationTypes = () =>
    getSourcesApi().listApplicationTypes().then(data => ({ applicationTypes: data.data }));

export const doLoadAllApplications = () => getSourcesApi().listApplicationTypes().then(data => data.data);

export const findSource = (name) => getSourcesApi().postGraphQL({
    query: `{ sources(filter: {name: "${name}"})
        { id, name }
    }`
});
