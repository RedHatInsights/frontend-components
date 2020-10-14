import { handleError } from './handleError';

import { getSourcesApi } from './index';
import { patchSource } from './costManagementAuthentication';
import { checkAppAvailability } from './getApplicationStatus';

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
        // eslint-disable-next-line no-console
        console.log(error);
        return ({});
    }
};

export const urlOrHost = formData => formData.url ? parseUrl(formData.url) : formData;

export const handleErrorWrapper = (sourceId) => async(error) => await handleError(error, sourceId);

export const doCreateSource = async (formData, sourceTypes, timetoutedApps = []) => {
    let sourceDataOut;

    try {
        const source_type_id = sourceTypes.find((x) => x.name === formData.source_type).id;

        sourceDataOut = await getSourcesApi().createSource({ ...formData.source, source_type_id  });

        const promises = [];

        if (formData.endpoint) {
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

            promises.push(getSourcesApi().createEndpoint(endpointData));
        } else {
            promises.push(Promise.resolve(undefined));
        }

        if (formData.application && formData.application.application_type_id) {
            const applicationData = {
                ...formData.application,
                source_id: sourceDataOut.id
            };

            promises.push(getSourcesApi().createApplication(applicationData));
        } else {
            promises.push(Promise.resolve(undefined));
        }

        let [ endpointDataOut, applicationDataOut ] = await Promise.all(promises);

        let authenticationDataOut;

        if (endpointDataOut || (formData.authentication && applicationDataOut?.id)) {
            const authenticationData = {
                ...formData.authentication,
                resource_id: endpointDataOut?.id || applicationDataOut?.id,
                resource_type: endpointDataOut?.id ? 'Endpoint' : 'Application'
            };

            authenticationDataOut = await getSourcesApi().createAuthentication(authenticationData);
        }

        const promisesSecondRound = [];

        if (formData.credentials || formData.billing_source) {
            const { credentials, billing_source } = formData;
            let data = {};
            data = credentials ? { authentication: { credentials } } : {};
            data = billing_source ? { ...data, billing_source } : data;
            promisesSecondRound.push(patchSource({ id: sourceDataOut.id, ...data }));
        } else {
            promises.push(Promise.resolve(undefined));
        }

        if (authenticationDataOut && applicationDataOut) {
            const authAppData = {
                application_id: applicationDataOut.id,
                authentication_id: authenticationDataOut.id
            };

            promisesSecondRound.push(getSourcesApi().createAuthApp(authAppData));
        } else {
            promises.push(Promise.resolve(undefined));
        }

        await Promise.all(promisesSecondRound);

        sourceDataOut?.id && getSourcesApi().checkAvailabilitySource(sourceDataOut.id);

        if (applicationDataOut) {
            const timeout = timetoutedApps.includes(applicationDataOut.application_type_id) ? 10000 : 0;
            applicationDataOut = await checkAppAvailability(applicationDataOut.id, timeout);
        }

        return {
            ...sourceDataOut,
            endpoint: [ endpointDataOut ],
            applications: [ applicationDataOut ]
        };
    } catch (error) {
        const errorMessage = await handleError(error, sourceDataOut ? sourceDataOut.id : undefined);
        throw errorMessage;
    }
};
