import { postBillingSource } from './billingSource';
import { handleError } from './handleError';

import { getSourcesApi } from './index';

export const parseUrl = url => {
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

export const urlOrHost = formData => formData.url ? parseUrl(formData.url) : formData;

export function doCreateSource(formData, sourceTypes) {
    const source_type_id = sourceTypes.find((x) => x.name === formData.source_type).id;

    return getSourcesApi().createSource({ ...formData.source, source_type_id  }).then((sourceDataOut) => {
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
                    .catch(async (error) => {
                        const errorMessage = await handleError(error, sourceDataOut.id);
                        throw errorMessage;
                    });
                }

                return source;
            }, async (error) => {
                const errorMessage = await handleError(error, sourceDataOut.id);
                throw errorMessage;
            });
        }).catch(async (error) => {
            const errorMessage = await handleError(error, sourceDataOut.id);
            throw errorMessage;
        });
    }, async (error) => {
        if (typeof error === 'string') {
            throw error;
        }

        const errorMessage = await handleError(error);
        throw errorMessage;
    });
}
