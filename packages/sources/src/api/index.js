/* eslint-disable camelcase */
import axios from 'axios';
import { DefaultApi as SourcesDefaultApi } from '@redhat-cloud-services/sources-client';
import { Base64 } from 'js-base64';

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
    let sourceData = {
        name: formData.source_name,
        source_type_id: sourceTypes.find((x) => x.name === formData.source_type).id
    };

    return getSourcesApi().createSource(sourceData).then((sourceDataOut) => {
        const { scheme, host, port, path } = urlOrHost(formData);

        const endPointPort = parseInt(port, 10);

        const endpointData = {
            default: true,
            source_id: sourceDataOut.id,
            role: formData.role,
            scheme,
            host,
            port: isNaN(endPointPort) ? undefined : endPointPort,
            path,
            verify_ssl: formData.verify_ssl,
            certificate_authority: formData.certificate_authority
        };

        const promises = [ getSourcesApi().createEndpoint(endpointData) ];

        if (formData.app_type) {
            const applicationData = {
                application_type_id: formData.app_type,
                source_id: sourceDataOut.id
            };

            promises.push(getSourcesApi().createApplication(applicationData));
        }

        return Promise.all(promises).then(([ endpointDataOut, _applicationData = undefined ]) => {
            const authenticationData = {
                resource_id: endpointDataOut.id,
                resource_type: 'Endpoint',
                username: formData.username,
                password: formData.token || formData.password,
                authtype: formData.authtype
            };

            return getSourcesApi().createAuthentication(authenticationData).then((authenticationDataOut) => {
                return authenticationDataOut;
            }, (_error) => {
                console.error('Authentication creation failure.');
                throw { error: 'Authentication creation failure.' };
            });
        }).catch(e => {
            console.error(e);
            throw { error: e };
        });
    }, (_error) => {
        console.error('Source creation failure.');
        throw { error: 'Source creation failure.' };
    });
}

export const doLoadAllApplications = () => getSourcesApi().listApplicationTypes().then(data => data.data);
