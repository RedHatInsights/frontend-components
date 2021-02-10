import axiosInstanceInsights from '@redhat-cloud-services/frontend-components-utilities/interceptors';

import { SOURCES_API_BASE_V3 } from './constants';

const axiosInstance = axiosInstanceInsights;

export { axiosInstance };

export const getSourcesApi = () => ({
    createEndpoint: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE_V3}/endpoints`, data),
    createAuthentication: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE_V3}/authentications`, data),
    deleteSource: (id) => axiosInstanceInsights.delete(`${SOURCES_API_BASE_V3}/sources/${id}`),
    createApplication: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE_V3}/applications`, data),
    postGraphQL: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE_V3}/graphql`, data),
    listSourceTypes: () => axiosInstanceInsights.get(`${SOURCES_API_BASE_V3}/source_types`),
    listApplicationTypes: () => axiosInstanceInsights.get(`${SOURCES_API_BASE_V3}/application_types`),
    createSource: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE_V3}/sources`, data),
    createAuthApp: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE_V3}/application_authentications`, data),
    getApplication: (id) => axiosInstanceInsights.get(`${SOURCES_API_BASE_V3}/applications/${id}`),
    getEndpoint: (id) => axiosInstanceInsights.get(`${SOURCES_API_BASE_V3}/endpoints/${id}`),
    removeSource: (id) => axiosInstanceInsights.delete(`${SOURCES_API_BASE_V3}/sources/${id}`),
    checkAvailabilitySource: (id) => axiosInstanceInsights.post(`${SOURCES_API_BASE_V3}/sources/${id}/check_availability`),
    getGoogleAccount: () => axiosInstanceInsights.get(`${SOURCES_API_BASE_V3}/app_meta_data?filter[name]=gcp_service_account`)
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
