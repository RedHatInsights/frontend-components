import { doCreateSource, parseUrl, urlOrHost } from '../../api/createSource';
import sourceTypes, { OPENSHIFT_TYPE } from '../helpers/sourceTypes';
import { COST_MANAGEMENT_APP } from '../helpers/applicationTypes';

import * as api from '../../api/index';
import * as cmAuthApi from '../../api/costManagementAuthentication';
import * as errorHandling from '../../api/handleError';
import * as checkApp from '../../api/getApplicationStatus';

describe('doCreateSource', () => {
    const HOST = 'mycluster.net';
    const PATH = '/path';
    const PORT = '1234';
    const SCHEME = 'https';

    const URL = `${SCHEME}://${HOST}:${PORT}${PATH}`;

    const EXPECTED_URL_OBJECT = {
        host: HOST,
        path: PATH,
        port: PORT,
        scheme: SCHEME
    };

    describe('source creation api', () => {
        let TYPE_NAME;
        let SOURCE_NAME;

        let FORM_DATA;
        let SOURCE_FORM_DATA;
        let AUTHENTICATION_FORM_DATA;
        let ENDPOINT_FORM_DATA;
        let APPLICATION_FORM_DATA;

        let INITIAL_VALUES;

        let CREATED_SOURCE_ID;
        let CREATE_SOURCE_DATA_OUT;

        let CREATED_EDNPOINT_ID;
        let CREATE_EDNPOINT_DATA_OUT;

        let CREATE_AUTHENTICATION_DATA_OUT;
        let CREATE_APPLICATION_DATA_OUT;
        let CREATE_AUTH_APP_DATA_OUT;
        let COST_MGMT_AUTH_OUT;

        let createSource;
        let createEndpoint;
        let createApplication;
        let createAuthentication;
        let createAuthApp;

        let patchSource;

        let checkAvailabilitySource;

        let checkAppMock;

        let mocks;

        let EXPECTED_CREATE_SOURCE_ARG;
        let EXPECTED_AUTHENTICATION_SOURCE_ARG;
        let EXPECTED_CREATE_ENDPOINT_SOURCE_ARG;
        let EXPECTED_CREATE_AUTH_APP_ARG;

        beforeEach(() => {
            TYPE_NAME = OPENSHIFT_TYPE.name;
            SOURCE_NAME = 'some name';

            FORM_DATA = { source_type: TYPE_NAME };
            SOURCE_FORM_DATA = {
                name: SOURCE_NAME
            };
            AUTHENTICATION_FORM_DATA = {
                password: '123455'

            };
            ENDPOINT_FORM_DATA = { url: 'https//' };
            APPLICATION_FORM_DATA = { collect_info: true };

            INITIAL_VALUES = {
                ...FORM_DATA,
                source: SOURCE_FORM_DATA,
                authentication: AUTHENTICATION_FORM_DATA,
                endpoint: ENDPOINT_FORM_DATA
            };

            CREATED_SOURCE_ID = '12349876';
            CREATE_SOURCE_DATA_OUT = ({ id: CREATED_SOURCE_ID });

            CREATED_EDNPOINT_ID = '8765';
            CREATE_EDNPOINT_DATA_OUT = ({ id: CREATED_EDNPOINT_ID });

            CREATE_AUTHENTICATION_DATA_OUT = { something: '123', id: '989' };
            CREATE_APPLICATION_DATA_OUT = { application: 234, id: '234', application_type_id: COST_MANAGEMENT_APP.id };
            CREATE_AUTH_APP_DATA_OUT = { application_id: '234', authentication_id: '989' };
            COST_MGMT_AUTH_OUT = { authentication: 1 };

            createSource = jest.fn().mockImplementation(() => Promise.resolve(CREATE_SOURCE_DATA_OUT));
            createEndpoint = jest.fn().mockImplementation(() => Promise.resolve(CREATE_EDNPOINT_DATA_OUT));
            createAuthentication = jest.fn().mockImplementation(() => Promise.resolve(CREATE_AUTHENTICATION_DATA_OUT));
            createApplication = jest.fn().mockImplementation(() => Promise.resolve(CREATE_APPLICATION_DATA_OUT));
            createAuthApp = jest.fn().mockImplementation(() => Promise.resolve(CREATE_AUTH_APP_DATA_OUT));

            patchSource = jest.fn().mockImplementation(() => Promise.resolve(COST_MGMT_AUTH_OUT));

            checkAppMock = jest.fn().mockImplementation(() => Promise.resolve(CREATE_APPLICATION_DATA_OUT));
            checkApp.checkAppAvailability = checkAppMock;

            checkAvailabilitySource = jest.fn();

            mocks = {
                createSource,
                createEndpoint,
                createApplication,
                createAuthentication,
                createAuthApp,
                checkAvailabilitySource
            };

            EXPECTED_CREATE_SOURCE_ARG = { ...SOURCE_FORM_DATA, source_type_id: OPENSHIFT_TYPE.id };
            EXPECTED_AUTHENTICATION_SOURCE_ARG = {
                ...AUTHENTICATION_FORM_DATA,
                resource_id: CREATED_EDNPOINT_ID,
                resource_type: 'Endpoint'
            };
            EXPECTED_CREATE_ENDPOINT_SOURCE_ARG = {
                ...ENDPOINT_FORM_DATA,
                default: true,
                source_id: CREATED_SOURCE_ID
            };

            EXPECTED_CREATE_AUTH_APP_ARG = {
                application_id: CREATE_APPLICATION_DATA_OUT.id,
                authentication_id: CREATE_AUTHENTICATION_DATA_OUT.id
            };
        });

        afterEach(() => {
            createSource.mockReset();
            createEndpoint.mockReset();
            createApplication.mockReset();
            createAuthentication.mockReset();
        });

        it('create source with no app', async () => {
            const FORM_DATA = {
                ...INITIAL_VALUES
            };
            const EXPECTED_RESULT = {
                id: CREATED_SOURCE_ID,
                endpoint: [
                    { ...CREATE_EDNPOINT_DATA_OUT }
                ],
                applications: [ undefined ]
            };

            api.getSourcesApi = () => mocks;

            const result = await doCreateSource(FORM_DATA, sourceTypes);

            expect(result).toEqual(EXPECTED_RESULT);

            expect(createSource).toHaveBeenCalledWith(EXPECTED_CREATE_SOURCE_ARG);
            expect(createEndpoint).toHaveBeenCalledWith(EXPECTED_CREATE_ENDPOINT_SOURCE_ARG);
            expect(createAuthentication).toHaveBeenCalledWith(EXPECTED_AUTHENTICATION_SOURCE_ARG);
            expect(createApplication).not.toHaveBeenCalled();
            expect(patchSource).not.toHaveBeenCalled();
            expect(createAuthApp).not.toHaveBeenCalled();
            expect(checkAppMock).not.toHaveBeenCalled();
            expect(checkAvailabilitySource).toHaveBeenCalledWith(CREATE_SOURCE_DATA_OUT.id);
        });

        it('create source with noEndpoint set', async () => {
            const FORM_DATA = {
                ...INITIAL_VALUES,
                endpoint: undefined
            };
            const EXPECTED_RESULT = {
                id: CREATED_SOURCE_ID,
                endpoint: [ undefined ],
                applications: [ undefined ]
            };

            api.getSourcesApi = () => mocks;

            const result = await doCreateSource(FORM_DATA, sourceTypes);

            expect(result).toEqual(EXPECTED_RESULT);

            expect(createSource).toHaveBeenCalledWith(EXPECTED_CREATE_SOURCE_ARG);
            expect(createEndpoint).not.toHaveBeenCalled();
            expect(createAuthentication).not.toHaveBeenCalled();
            expect(createApplication).not.toHaveBeenCalled();
            expect(patchSource).not.toHaveBeenCalled();
            expect(createAuthApp).not.toHaveBeenCalled();
            expect(checkAppMock).not.toHaveBeenCalled();
            expect(checkAvailabilitySource).toHaveBeenCalledWith(CREATE_SOURCE_DATA_OUT.id);
        });

        it('create source with url', async () => {
            const FORM_DATA = {
                ...INITIAL_VALUES,
                url: URL
            };
            const EXPECTED_RESULT = {
                id: CREATED_SOURCE_ID,
                endpoint: [
                    CREATE_EDNPOINT_DATA_OUT
                ],
                applications: [ undefined ]
            };

            api.getSourcesApi = () => mocks;

            const result = await doCreateSource(FORM_DATA, sourceTypes);

            const EXPECTED_ENDPOINT_ARG_WITH_URL_PORT_IS_NUMBER = {
                ...EXPECTED_CREATE_ENDPOINT_SOURCE_ARG,
                ...EXPECTED_URL_OBJECT,
                port: Number(EXPECTED_URL_OBJECT.port)
            };

            expect(result).toEqual(EXPECTED_RESULT);

            expect(createSource).toHaveBeenCalledWith(EXPECTED_CREATE_SOURCE_ARG);
            expect(createEndpoint).toHaveBeenCalledWith(EXPECTED_ENDPOINT_ARG_WITH_URL_PORT_IS_NUMBER);
            expect(createAuthentication).toHaveBeenCalledWith(EXPECTED_AUTHENTICATION_SOURCE_ARG);
            expect(createApplication).not.toHaveBeenCalled();
            expect(patchSource).not.toHaveBeenCalled();
            expect(createAuthApp).not.toHaveBeenCalled();
            expect(checkAppMock).not.toHaveBeenCalled();
            expect(checkAvailabilitySource).toHaveBeenCalledWith(CREATE_SOURCE_DATA_OUT.id);
        });

        it('create source with app', async () => {
            const APP_ID = COST_MANAGEMENT_APP.id;

            const FORM_DATA = {
                ...INITIAL_VALUES,
                application: { ...APPLICATION_FORM_DATA, application_type_id: APP_ID }
            };
            const EXPECTED_RESULT = {
                id: CREATED_SOURCE_ID,
                endpoint: [
                    { ...CREATE_EDNPOINT_DATA_OUT }
                ],
                applications: [{
                    ...CREATE_APPLICATION_DATA_OUT
                }]
            };

            const EXPECTED_CREATE_APPLICATION_ARG = {
                ...APPLICATION_FORM_DATA,
                source_id: CREATED_SOURCE_ID,
                application_type_id: APP_ID
            };

            api.getSourcesApi = () => mocks;

            const result = await doCreateSource(FORM_DATA, sourceTypes);

            expect(result).toEqual(EXPECTED_RESULT);

            expect(createSource).toHaveBeenCalledWith(EXPECTED_CREATE_SOURCE_ARG);
            expect(createEndpoint).toHaveBeenCalledWith(EXPECTED_CREATE_ENDPOINT_SOURCE_ARG);
            expect(createAuthentication).toHaveBeenCalledWith(EXPECTED_AUTHENTICATION_SOURCE_ARG);
            expect(createApplication).toHaveBeenCalledWith(EXPECTED_CREATE_APPLICATION_ARG);
            expect(patchSource).not.toHaveBeenCalled();
            expect(createAuthApp).toHaveBeenCalledWith(EXPECTED_CREATE_AUTH_APP_ARG);
            expect(checkAppMock).toHaveBeenCalledWith(CREATE_APPLICATION_DATA_OUT.id, 0);
            expect(checkAvailabilitySource).toHaveBeenCalledWith(CREATE_SOURCE_DATA_OUT.id);
        });

        it('create source with app with timeout', async () => {
            const APP_ID = COST_MANAGEMENT_APP.id;

            const FORM_DATA = {
                ...INITIAL_VALUES,
                application: { ...APPLICATION_FORM_DATA, application_type_id: APP_ID }
            };
            const EXPECTED_RESULT = {
                id: CREATED_SOURCE_ID,
                endpoint: [
                    { ...CREATE_EDNPOINT_DATA_OUT }
                ],
                applications: [{
                    ...CREATE_APPLICATION_DATA_OUT
                }]
            };

            const EXPECTED_CREATE_APPLICATION_ARG = {
                ...APPLICATION_FORM_DATA,
                source_id: CREATED_SOURCE_ID,
                application_type_id: APP_ID
            };

            api.getSourcesApi = () => mocks;

            const timeoutedApps = [ COST_MANAGEMENT_APP.id ];

            const result = await doCreateSource(FORM_DATA, sourceTypes, timeoutedApps);

            expect(result).toEqual(EXPECTED_RESULT);

            expect(createSource).toHaveBeenCalledWith(EXPECTED_CREATE_SOURCE_ARG);
            expect(createEndpoint).toHaveBeenCalledWith(EXPECTED_CREATE_ENDPOINT_SOURCE_ARG);
            expect(createAuthentication).toHaveBeenCalledWith(EXPECTED_AUTHENTICATION_SOURCE_ARG);
            expect(createApplication).toHaveBeenCalledWith(EXPECTED_CREATE_APPLICATION_ARG);
            expect(patchSource).not.toHaveBeenCalled();
            expect(createAuthApp).toHaveBeenCalledWith(EXPECTED_CREATE_AUTH_APP_ARG);
            expect(checkAppMock).toHaveBeenCalledWith(CREATE_APPLICATION_DATA_OUT.id, 10000);
            expect(checkAvailabilitySource).toHaveBeenCalledWith(CREATE_SOURCE_DATA_OUT.id);
        });

        it('create source with app and no endpoint set', async () => {
            const APP_ID = COST_MANAGEMENT_APP.id;

            const FORM_DATA = {
                ...INITIAL_VALUES,
                application: { ...APPLICATION_FORM_DATA, application_type_id: APP_ID },
                endpoint: undefined,
                authentication: undefined
            };

            const EXPECTED_RESULT = {
                id: CREATED_SOURCE_ID,
                endpoint: [ undefined ],
                applications: [{
                    ...CREATE_APPLICATION_DATA_OUT
                }]
            };

            const EXPECTED_CREATE_APPLICATION_ARG = {
                ...APPLICATION_FORM_DATA,
                source_id: CREATED_SOURCE_ID,
                application_type_id: APP_ID
            };

            api.getSourcesApi = () => mocks;

            const result = await doCreateSource(FORM_DATA, sourceTypes);

            expect(result).toEqual(EXPECTED_RESULT);

            expect(createSource).toHaveBeenCalledWith(EXPECTED_CREATE_SOURCE_ARG);
            expect(createEndpoint).not.toHaveBeenCalled();
            expect(createAuthentication).not.toHaveBeenCalled();
            expect(createApplication).toHaveBeenCalledWith(EXPECTED_CREATE_APPLICATION_ARG);
            expect(patchSource).not.toHaveBeenCalled();
            expect(createAuthApp).not.toHaveBeenCalled();
            expect(checkAppMock).toHaveBeenCalledWith(CREATE_APPLICATION_DATA_OUT.id, 0);
            expect(checkAvailabilitySource).toHaveBeenCalledWith(CREATE_SOURCE_DATA_OUT.id);
        });

        it('create source with app and no endpoint set', async () => {
            const APP_ID = COST_MANAGEMENT_APP.id;

            const FORM_DATA = {
                ...INITIAL_VALUES,
                application: { ...APPLICATION_FORM_DATA, application_type_id: APP_ID },
                endpoint: undefined,
                authentication: AUTHENTICATION_FORM_DATA
            };

            const EXPECTED_RESULT = {
                id: CREATED_SOURCE_ID,
                endpoint: [ undefined ],
                applications: [{
                    ...CREATE_APPLICATION_DATA_OUT
                }]
            };

            const EXPECTED_CREATE_APPLICATION_ARG = {
                ...APPLICATION_FORM_DATA,
                source_id: CREATED_SOURCE_ID,
                application_type_id: APP_ID
            };

            EXPECTED_AUTHENTICATION_SOURCE_ARG = {
                ...AUTHENTICATION_FORM_DATA,
                resource_id: CREATE_APPLICATION_DATA_OUT.id,
                resource_type: 'Application'
            };

            EXPECTED_CREATE_AUTH_APP_ARG = {
                application_id: CREATE_APPLICATION_DATA_OUT.id,
                authentication_id: CREATE_AUTHENTICATION_DATA_OUT.id
            };

            api.getSourcesApi = () => mocks;

            const result = await doCreateSource(FORM_DATA, sourceTypes);

            expect(result).toEqual(EXPECTED_RESULT);

            expect(createSource).toHaveBeenCalledWith(EXPECTED_CREATE_SOURCE_ARG);
            expect(createEndpoint).not.toHaveBeenCalled();
            expect(createAuthentication).toHaveBeenCalledWith(EXPECTED_AUTHENTICATION_SOURCE_ARG);
            expect(createApplication).toHaveBeenCalledWith(EXPECTED_CREATE_APPLICATION_ARG);
            expect(patchSource).not.toHaveBeenCalled();
            expect(createAuthApp).toHaveBeenCalledWith(EXPECTED_CREATE_AUTH_APP_ARG);
            expect(checkAppMock).toHaveBeenCalledWith(CREATE_APPLICATION_DATA_OUT.id, 0);
            expect(checkAvailabilitySource).toHaveBeenCalledWith(CREATE_SOURCE_DATA_OUT.id);
        });

        it('create source with app billing source', async () => {
            const APP_ID = COST_MANAGEMENT_APP.id;
            const BILLING_SOURCE_DATA = {
                billing_source: {
                    data_source: {
                        bucket: 'bucket'
                    }
                }
            };

            const FORM_DATA = {
                ...INITIAL_VALUES,
                application: { ...APPLICATION_FORM_DATA, application_type_id: APP_ID },
                ...BILLING_SOURCE_DATA
            };
            const EXPECTED_RESULT = {
                id: CREATED_SOURCE_ID,
                endpoint: [
                    { ...CREATE_EDNPOINT_DATA_OUT }
                ],
                applications: [{
                    ...CREATE_APPLICATION_DATA_OUT
                }]
            };

            const EXPECTED_CREATE_APPLICATION_ARG = {
                ...APPLICATION_FORM_DATA,
                source_id: CREATED_SOURCE_ID,
                application_type_id: APP_ID
            };

            const EXPECTED_BILLING_SOURCE_ARG = {
                id: CREATED_SOURCE_ID,
                ...BILLING_SOURCE_DATA
            };

            api.getSourcesApi = () => mocks;
            cmAuthApi.patchSource = patchSource;
            const result = await doCreateSource(FORM_DATA, sourceTypes);

            expect(result).toEqual(EXPECTED_RESULT);

            expect(createSource).toHaveBeenCalledWith(EXPECTED_CREATE_SOURCE_ARG);
            expect(createEndpoint).toHaveBeenCalledWith(EXPECTED_CREATE_ENDPOINT_SOURCE_ARG);
            expect(createAuthentication).toHaveBeenCalledWith(EXPECTED_AUTHENTICATION_SOURCE_ARG);
            expect(createApplication).toHaveBeenCalledWith(EXPECTED_CREATE_APPLICATION_ARG);
            expect(patchSource).toHaveBeenCalledWith(EXPECTED_BILLING_SOURCE_ARG);
            expect(createAuthApp).toHaveBeenCalledWith(EXPECTED_CREATE_AUTH_APP_ARG);
            expect(checkAppMock).toHaveBeenCalledWith(CREATE_APPLICATION_DATA_OUT.id, 0);
            expect(checkAvailabilitySource).toHaveBeenCalledWith(CREATE_SOURCE_DATA_OUT.id);
        });

        it('create source with app cost management source', async () => {
            const APP_ID = COST_MANAGEMENT_APP.id;
            const BILLING_SOURCE_DATA = {
                billing_source: {
                    data_source: {
                        storage_account: 'sa',
                        resource_group: 'rg'
                    }
                }
            };
            const CREDENTIALS = {
                credentials: 'MY_CREDS_1'
            };
            const FORM_DATA = {
                ...INITIAL_VALUES,
                source_type: 'azure',
                application: { ...APPLICATION_FORM_DATA, application_type_id: APP_ID },
                ...CREDENTIALS,
                ...BILLING_SOURCE_DATA
            };
            const EXPECTED_RESULT = {
                id: CREATED_SOURCE_ID,
                endpoint: [
                    { ...CREATE_EDNPOINT_DATA_OUT }
                ],
                applications: [{
                    ...CREATE_APPLICATION_DATA_OUT
                }]
            };

            const EXPECTED_CREATE_APPLICATION_ARG = {
                ...APPLICATION_FORM_DATA,
                source_id: CREATED_SOURCE_ID,
                application_type_id: APP_ID
            };

            const EXPECTED_CREDENTIALS_ARG = {
                id: CREATED_SOURCE_ID,
                billing_source: {
                    data_source: {
                        resource_group: 'rg',
                        storage_account: 'sa'
                    }
                },
                authentication: {
                    credentials: 'MY_CREDS_1'
                }
            };

            api.getSourcesApi = () => mocks;
            cmAuthApi.patchSource = patchSource;

            const result = await doCreateSource(FORM_DATA, sourceTypes);
            expect(result).toEqual(EXPECTED_RESULT);

            expect(createSource).toHaveBeenCalledWith({ ...EXPECTED_CREATE_SOURCE_ARG, source_type_id: '8' });
            expect(createEndpoint).toHaveBeenCalledWith(EXPECTED_CREATE_ENDPOINT_SOURCE_ARG);
            expect(createAuthentication).toHaveBeenCalledWith(EXPECTED_AUTHENTICATION_SOURCE_ARG);
            expect(createApplication).toHaveBeenCalledWith(EXPECTED_CREATE_APPLICATION_ARG);
            expect(patchSource).toHaveBeenCalledWith(EXPECTED_CREDENTIALS_ARG);
            expect(createAuthApp).toHaveBeenCalledWith(EXPECTED_CREATE_AUTH_APP_ARG);
            expect(checkAppMock).toHaveBeenCalledWith(CREATE_APPLICATION_DATA_OUT.id, 0);
            expect(checkAvailabilitySource).toHaveBeenCalledWith(CREATE_SOURCE_DATA_OUT.id);
        });

        describe('failures', () => {
            let ERROR_MESSAGE;
            let returnError;
            let FORM_DATA;

            beforeEach(() => {
                ERROR_MESSAGE = 'some error message';
                errorHandling.handleError = jest.fn().mockImplementation((error) => Promise.resolve(error));
                returnError = jest.fn().mockImplementation(() => Promise.reject(ERROR_MESSAGE));
                FORM_DATA = {
                    ...INITIAL_VALUES
                };
            });

            afterEach(() => {
                errorHandling.handleError.mockReset();
                returnError.mockReset();
            });

            it('source creation failed', async () => {
                api.getSourcesApi = () => ({
                    ...mocks,
                    createSource: returnError
                });

                let result;
                try {
                    result = await doCreateSource(FORM_DATA, sourceTypes);
                } catch (error) {
                    result = error;
                }

                expect(result).toEqual(ERROR_MESSAGE);
                expect(returnError).toHaveBeenCalled();

                expect(createEndpoint).not.toHaveBeenCalled();
                expect(createAuthentication).not.toHaveBeenCalled();
                expect(createApplication).not.toHaveBeenCalled();
                expect(patchSource).not.toHaveBeenCalled();
                expect(createAuthApp).not.toHaveBeenCalled();
                expect(checkAppMock).not.toHaveBeenCalled();
                expect(checkAvailabilitySource).not.toHaveBeenCalled();
            });

            it('source creation failed because of endpoint', async () => {
                api.getSourcesApi = () => ({
                    ...mocks,
                    createEndpoint: returnError
                });

                let result;
                try {
                    result = await doCreateSource(FORM_DATA, sourceTypes);
                } catch (error) {
                    result = error;
                }

                expect(result).toEqual(ERROR_MESSAGE);
                expect(returnError).toHaveBeenCalled();
                expect(errorHandling.handleError).toHaveBeenCalledWith(ERROR_MESSAGE, CREATED_SOURCE_ID);

                expect(createAuthentication).not.toHaveBeenCalled();
                expect(createApplication).not.toHaveBeenCalled();
                expect(patchSource).not.toHaveBeenCalled();
                expect(createAuthApp).not.toHaveBeenCalled();
                expect(checkAppMock).not.toHaveBeenCalled();
                expect(checkAvailabilitySource).not.toHaveBeenCalled();
            });

            it('source creation failed because of authentication', async () => {
                api.getSourcesApi = () => ({
                    ...mocks,
                    createAuthentication: returnError
                });

                let result;
                try {
                    result = await doCreateSource(FORM_DATA, sourceTypes);
                } catch (error) {
                    result = error;
                }

                expect(result).toEqual(ERROR_MESSAGE);
                expect(returnError).toHaveBeenCalled();
                expect(errorHandling.handleError).toHaveBeenCalledWith(ERROR_MESSAGE, CREATED_SOURCE_ID);

                expect(createApplication).not.toHaveBeenCalled();
                expect(patchSource).not.toHaveBeenCalled();
                expect(createAuthApp).not.toHaveBeenCalled();
                expect(checkAppMock).not.toHaveBeenCalled();
                expect(checkAvailabilitySource).not.toHaveBeenCalled();
            });

            it('source creation failed because of application', async () => {
                FORM_DATA = {
                    ...FORM_DATA,
                    application: { application_type_id: '1' }
                };

                api.getSourcesApi = () => ({
                    ...mocks,
                    createApplication: returnError
                });

                let result;
                try {
                    result = await doCreateSource(FORM_DATA, sourceTypes);
                } catch (error) {
                    result = error;
                }

                expect(result).toEqual(ERROR_MESSAGE);
                expect(returnError).toHaveBeenCalled();
                expect(errorHandling.handleError).toHaveBeenCalledWith(ERROR_MESSAGE, CREATED_SOURCE_ID);

                expect(patchSource).not.toHaveBeenCalled();
                expect(createAuthApp).not.toHaveBeenCalled();
                expect(checkAppMock).not.toHaveBeenCalled();
                expect(checkAvailabilitySource).not.toHaveBeenCalled();
            });

            it('source creation failed because of billing source', async () => {
                const BILLING_SOURCE = { bucket: 'cosi' };

                FORM_DATA = {
                    ...FORM_DATA,
                    application: { application_type_id: '1' },
                    billing_source: BILLING_SOURCE
                };

                api.getSourcesApi = () => mocks;
                cmAuthApi.patchSource = returnError;

                let result;
                try {
                    result = await doCreateSource(FORM_DATA, sourceTypes);
                } catch (error) {
                    result = error;
                }

                expect(result).toEqual(ERROR_MESSAGE);
                expect(returnError).toHaveBeenCalled();
                expect(errorHandling.handleError).toHaveBeenCalledWith(ERROR_MESSAGE, CREATED_SOURCE_ID);
                expect(checkAvailabilitySource).not.toHaveBeenCalled();
            });
        });
    });

    describe('helpers', () => {
        const EMPTY_OBJECT = {};

        describe('parseUrl', () => {
            it('parses URL', () => {
                expect(parseUrl(URL)).toEqual(EXPECTED_URL_OBJECT);
            });

            it('parses undefined', () => {
                expect(parseUrl(undefined)).toEqual(EMPTY_OBJECT);
            });

            it('throw empty object on error', () => {
                // eslint-disable-next-line no-console
                const tmpLog = console.log;
                // eslint-disable-next-line no-console
                console.log = jest.fn();

                const HOST = 'mycluster.net';
                const PATH = '/path';
                const PORT = '1234';
                const SCHEME = 'https';

                const WRONG_URL = `://${HOST}${SCHEME}:${PORT}${PATH}`;

                expect(parseUrl(WRONG_URL)).toEqual(EMPTY_OBJECT);

                // eslint-disable-next-line no-console
                console.log = tmpLog;
            });
        });

        describe('urlOrHost', () => {
            it('returns form data', () => {
                const FORM_DATA_WITHOUT_URL = {
                    port: '1234',
                    scheme: 'https'
                };

                expect(urlOrHost(FORM_DATA_WITHOUT_URL)).toEqual(FORM_DATA_WITHOUT_URL);
            });

            it('returns parsed url', () => {
                expect(urlOrHost({ url: URL })).toEqual(EXPECTED_URL_OBJECT);
            });
        });
    });
});
