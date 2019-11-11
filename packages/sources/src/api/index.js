import { DefaultApi as SourcesDefaultApi } from '@redhat-cloud-services/sources-client';
import axiosInstanceInsights from '@redhat-cloud-services/frontend-components-utilities/files/interceptors';

import { SOURCES_API_BASE } from './constants';

const axiosInstance = axiosInstanceInsights;

export { axiosInstance };

let apiInstance;

export const getSourcesApi = () =>
    apiInstance || (apiInstance = new SourcesDefaultApi(undefined, SOURCES_API_BASE, axiosInstance));

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
