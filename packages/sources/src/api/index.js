import axios from 'axios';
import { DefaultApi as SourcesDefaultApi } from '@redhat-cloud-services/sources-client';
import { Base64 } from 'js-base64';
import { postBillingSource } from './billingSource';

const calculateApiBase = b => (
    (b.endsWith('/') && `${b}v1.0`) || `${b}/sources/v1.0`
);

export const SOURCES_API_BASE = calculateApiBase(process.env.BASE_PATH || '');

const axiosInstance = axios.create(
    process.env.FAKE_IDENTITY ? {
        headers: {
            common: {
                'x-rh-identity': Base64.encode(
                    JSON.stringify(
                        {
                            identity: { account_number: process.env.FAKE_IDENTITY }
                        }
                    )
                )
            }
        }
    } : {}
);

axiosInstance.interceptors.request.use(async (config) => {
    await window.insights.chrome.auth.getUser();
    return config;
});
axiosInstance.interceptors.response.use(response => response.data || response);
axiosInstance.interceptors.response.use(null, error => { throw { ...error.response }; });

export { axiosInstance };

let apiInstance;

export const getSourcesApi = () =>
    apiInstance || (apiInstance = new SourcesDefaultApi(undefined, SOURCES_API_BASE, axiosInstance));

export const doLoadSourceTypes = () =>
    getSourcesApi().listSourceTypes().then(data => ({ sourceTypes: data.data }));

export const doLoadApplicationTypes = () =>
    getSourcesApi().listApplicationTypes().then(data => ({ applicationTypes: data.data }));

const parseUrl = url => {
    if (!url) {
        return ({});
    }

    try {
        const u = new URL(url);
        return {
            scheme: u.protocol.replace(/:$/, ''),
            host: u.hostname,
            port: u.port,
            path: u.pathname
        };
    } catch (error) {
        console.log(error);
        return ({});
    }
};

/*
     * If there's an URL in the formData, parse it and use it,
     * else use individual fields (scheme, host, port, path).
     */

const urlOrHost = formData => formData.url ? parseUrl(formData.url) : formData;

export function doCreateSource(formData, sourceTypes) {
    const source_type_id = sourceTypes.find((x) => x.name === formData.source_type).id;

    return getSourcesApi().createSource({ ...formData.source, source_type_id }).then((sourceDataOut) => {
        const { scheme, host, port, path } = urlOrHost(formData);

        const endPointPort = parseInt(port, 10);

        const endpointData = {
            ...formData.endpoint,
            default: true,
            source_id: sourceDataOut.id,
            scheme,
            host,
            port: isNaN(endPointPort) ? undefined : endPointPort,
            path
        };

        const promises = [ getSourcesApi().createEndpoint(endpointData) ];

        if (formData.application.application_type_id) {
            const applicationData = {
                ...formData.application,
                source_id: sourceDataOut.id
            };

            promises.push(getSourcesApi().createApplication(applicationData));
        }

        return Promise.all(promises).then(([ endpointDataOut, applicationDataOut = undefined ]) => {
            const authenticationData = {
                ...formData.authentication,
                resource_id: endpointDataOut.id,
                resource_type: 'Endpoint'
            };

            return getSourcesApi().createAuthentication(authenticationData).then(() => {
                const source = {
                    ...sourceDataOut,
                    endpoint: [ endpointDataOut ],
                    applications: [ applicationDataOut ]
                };

                if (formData.billing_source) {
                    const billingSourceData = {
                        billing_source: formData.billing_source,
                        source_id: sourceDataOut.id
                    };

                    return postBillingSource(billingSourceData).then(() => source)
                    .catch(error => { throw { error };});
                }

                return source;
            }, (error) => {
                console.error('Authentication creation failure:', error);
                throw { error };
            });
        }).catch(e => {
            console.error(e);
            throw { error: e };
        });
    }, (error) => {
        console.error('Source creation failure:', error);
        throw { error };
    });
}

export const doLoadAllApplications = () => getSourcesApi().listApplicationTypes().then(data => data.data);

export const findSource = (name) => getSourcesApi().postGraphQL({
    query: `{ sources(filter: {name: "${name}"})
        { id, name }
    }`
});
