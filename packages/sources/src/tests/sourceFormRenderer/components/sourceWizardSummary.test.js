import React from 'react';
import { Alert, DescriptionListGroup, DescriptionListTerm, DescriptionListDescription, Label } from '@patternfly/react-core';

import Summary, { createItem } from '../../../sourceFormRenderer/components/SourceWizardSummary';
import applicationTypes, { COST_MANAGEMENT_APP, SUB_WATCH_APP, TOPOLOGY_INV_APP } from '../../helpers/applicationTypes';
import sourceTypes from '../../helpers/sourceTypes';
import ValuePopover from '../../../sourceFormRenderer/components/ValuePopover';
import RendererContext from '@data-driven-forms/react-form-renderer/dist/esm/renderer-context';
import mount from '../../__mocks__/mount';
import { FormattedMessage } from 'react-intl';
import { NO_APPLICATION_VALUE } from '../../../utilities/stringConstants';

describe('SourceWizardSummary component', () => {
    describe('should render correctly', () => {
        let formOptions;
        let initialProps;

        const SourceWizardSummary = ({ formOptions, ...props }) => (
            <RendererContext.Provider value={{ formOptions }}>
                <Summary {...props} />
            </RendererContext.Provider>
        );

        const getListData = wrapper => wrapper
        .find(DescriptionListGroup)
        .map((group) => [ group.find(DescriptionListTerm).text(), group.find(DescriptionListDescription).text() ]);

        beforeEach(() => {
            formOptions = (source_type, authtype, application_type_id, validate = true) => ({
                getState: () => ({
                    values: {
                        source: {
                            name: 'openshift'
                        },
                        endpoint: {
                            certificate_authority: 'authority',
                            verify_ssl: validate
                        },
                        authentication: {
                            role: 'kubernetes',
                            password: '123456',
                            username: 'user_name',
                            validate,
                            extra: {
                                tenant: 'tenant1234'
                            },
                            authtype
                        },
                        url: 'neznam.cz',
                        source_type,
                        application: {
                            application_type_id
                        }
                    }
                })
            });

            initialProps = {
                sourceTypes,
                applicationTypes
            };
        });

        it('openshift', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('openshift', 'token', NO_APPLICATION_VALUE) }/>);

            const data = getListData(wrapper);

            expect(data).toEqual(
                [
                    [ 'Name', 'openshift' ],
                    [ 'Source type', 'OpenShift Container Platform' ],
                    [ 'Application', 'Not selected' ],
                    [ 'Authentication type', 'Token' ],
                    [ 'Token', '●●●●●●●●●●●●' ],
                    [ 'URL', 'neznam.cz' ],
                    [ 'Verify SSL', 'Enabled' ],
                    [ 'SSL Certificate', 'authority' ]
                ]
            );

            expect(wrapper.find(Alert)).toHaveLength(0);
        });

        it('openshift - NO_APPLICATION_VALUE set, ignore it', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('openshift', 'token') }/>);

            const data = getListData(wrapper);

            expect(data).toEqual(
                [
                    [ 'Name', 'openshift' ],
                    [ 'Source type', 'OpenShift Container Platform' ],
                    [ 'Application', 'Not selected' ],
                    [ 'Authentication type', 'Token' ],
                    [ 'Token', '●●●●●●●●●●●●' ],
                    [ 'URL', 'neznam.cz' ],
                    [ 'Verify SSL', 'Enabled' ],
                    [ 'SSL Certificate', 'authority' ]
                ]
            );

            expect(wrapper.find(Alert)).toHaveLength(0);
        });

        it('amazon', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('amazon', 'access_key_secret_key') } />);

            const data = getListData(wrapper);

            expect(data).toEqual(
                [
                    [ 'Name', 'openshift' ],
                    [ 'Source type', 'Amazon Web Services' ],
                    [ 'Application', 'Not selected' ],
                    [ 'Authentication type', 'AWS Secret Key' ],
                    [ 'Access key ID', 'user_name' ],
                    [ 'Secret access key', '●●●●●●●●●●●●' ] ]
            );

            // use labels from hardcoded schemas
            expect(wrapper.contains('Access Key')).toEqual(false);
            expect(wrapper.contains('Secret Key')).toEqual(false);
            expect(wrapper.contains('Access key ID')).toEqual(true);
            expect(wrapper.contains('Secret access key')).toEqual(true);

            expect(wrapper.find(Alert)).toHaveLength(0);
        });

        it('amazon - ARN', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('amazon', 'arn') } />);

            const data = getListData(wrapper);

            expect(data).toEqual(
                [
                    [ 'Name', 'openshift' ],
                    [ 'Source type', 'Amazon Web Services' ],
                    [ 'Application', 'Not selected' ],
                    [ 'Authentication type', 'ARN' ],
                    [ 'ARN', 'user_name' ] ]
            );

            expect(wrapper.find(Alert)).toHaveLength(0);
        });

        it('amazon - ARN cost management - include appended field from DB and rbac alert message', () => {
            formOptions = {
                getState: () => ({
                    values: {
                        source: { name: 'cosi' },
                        application: { application_type_id: '2', extra: { bucket: 'gfghf' } },
                        source_type: 'amazon',
                        authentication: { username: 'arn:aws:132', authtype: 'arn' },
                        fixasyncvalidation: '',
                        endpoint: { role: 'aws' }
                    }
                })
            };

            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions } />);

            const data = getListData(wrapper);

            expect(data).toEqual(
                [
                    [ 'Name', 'cosi' ],
                    [ 'Source type', 'Amazon Web Services' ],
                    [ 'Application', 'Cost Management' ],
                    [ 'S3 bucket name', 'gfghf' ],
                    [ 'ARN', 'arn:aws:132' ]
                ]
            );

            expect(wrapper.find(Alert).props().title).toEqual('Manage permissions in User Access');
            expect(wrapper.find(Alert).props().children).toEqual(
                'Make sure to manage permissions for this source in custom roles that contain permissions for Cost Management.'
            );
        });

        it('google - cost management - include google - cost alert', () => {
            formOptions = {
                getState: () => ({
                    values: {
                        source: { name: 'cosi' },
                        application: { application_type_id: '2', extra: { dataset: 'dataset_id_123' } },
                        source_type: 'google',
                        authentication: { authtype: 'project_id_service_account_json', username: 'project_id_123' },
                        fixasyncvalidation: ''
                    }
                })
            };

            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions } />);

            const headers = wrapper.find('dt').map(item => item.text());
            const data = wrapper.find('dd').map((item, index) => [ headers[index], item.text() ]);

            expect(data).toEqual(
                [
                    [ 'Name', 'cosi' ],
                    [ 'Source type', 'Google Cloud' ],
                    [ 'Application', 'Cost Management' ],
                    [ 'Project ID', 'project_id_123' ],
                    [ 'Dataset ID', 'dataset_id_123' ]
                ]
            );

            expect(wrapper.find(Alert)).toHaveLength(0);
        });

        it('openshift cost management - include appended field from DB and rbac alert message', () => {
            formOptions = {
                getState: () => ({
                    values: {
                        source: { name: 'cosi', source_ref: 'CLUSTER ID123' },
                        application: { application_type_id: COST_MANAGEMENT_APP.id },
                        source_type: 'openshift',
                        authentication: { authtype: 'token' },
                        auth_select: 'token'
                    }
                })
            };

            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions } />);

            const data = getListData(wrapper);

            expect(data).toEqual(
                [
                    [ 'Name', 'cosi' ],
                    [ 'Source type', 'OpenShift Container Platform' ],
                    [ 'Application', 'Cost Management' ],
                    [ 'Cluster Identifier', 'CLUSTER ID123' ]
                ]
            );

            expect(wrapper.find(Alert).props().title).toEqual('Manage permissions in User Access');
            expect(wrapper.find(Alert).props().children).toEqual(
                'Make sure to manage permissions for this source in custom roles that contain permissions for Cost Management.'
            );
        });

        it('account authorization', () => {
            formOptions = {
                getState: () => ({
                    values: {
                        source: { name: 'cosi', app_creation_workflow: 'account_authorization' },
                        applications: [ COST_MANAGEMENT_APP.id, TOPOLOGY_INV_APP.id ],
                        source_type: 'amazon',
                        authentication: { username: 'arn:aws:132', authtype: 'access_key_secret_key', password: 'secret_key' },
                        fixasyncvalidation: '',
                        endpoint: { role: 'aws' }
                    }
                })
            };

            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions } />);

            const data = getListData(wrapper);

            expect(data).toEqual(
                [
                    [ 'Name', 'cosi' ],
                    [ 'Source type', 'Amazon Web Services' ],
                    [ 'Configuration mode', 'Account authorization' ],
                    [ 'Applications', 'Cost ManagementTopological Inventory' ],
                    [ 'Access key ID', 'arn:aws:132' ],
                    [ 'Secret access key', '●●●●●●●●●●●●' ]
                ]
            );
        });

        it('account authorization - no apps', () => {
            formOptions = {
                getState: () => ({
                    values: {
                        source: { name: 'cosi', app_creation_workflow: 'account_authorization' },
                        applications: [],
                        source_type: 'amazon',
                        authentication: { username: 'arn:aws:132', authtype: 'access_key_secret_key', password: 'secret_key' },
                        fixasyncvalidation: '',
                        endpoint: { role: 'aws' }
                    }
                })
            };

            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions } />);

            const data = getListData(wrapper);

            expect(data).toEqual(
                [
                    [ 'Name', 'cosi' ],
                    [ 'Source type', 'Amazon Web Services' ],
                    [ 'Configuration mode', 'Account authorization' ],
                    [ 'Applications', 'None' ],
                    [ 'Access key ID', 'arn:aws:132' ],
                    [ 'Secret access key', '●●●●●●●●●●●●' ]
                ]
            );
        });

        it('manual authorization - no apps', () => {
            formOptions = {
                getState: () => ({
                    values: {
                        source: { name: 'cosi', app_creation_workflow: 'manual_configuration' },
                        applications: [],
                        source_type: 'amazon',
                        authentication: { username: 'arn:aws:132', authtype: 'access_key_secret_key', password: 'secret_key' },
                        fixasyncvalidation: '',
                        endpoint: { role: 'aws' }
                    }
                })
            };

            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions } />);

            const data = getListData(wrapper);

            expect(data).toEqual(
                [
                    [ 'Name', 'cosi' ],
                    [ 'Source type', 'Amazon Web Services' ],
                    [ 'Configuration mode', 'Manual configuration' ],
                    [ 'Application', 'Not selected' ],
                    [ 'Authentication type', 'AWS Secret Key' ],
                    [ 'Access key ID', 'arn:aws:132' ],
                    [ 'Secret access key', '●●●●●●●●●●●●' ]
                ]
            );
        });

        it('amazon - ARN subwatch - does not include auto registration', () => {
            formOptions = {
                getState: () => ({
                    values: {
                        source: { name: 'cosi' },
                        application: { application_type_id: SUB_WATCH_APP.id, extra: { auto_register: true } },
                        source_type: 'amazon',
                        authentication: { username: 'arn:aws:132', authtype: 'cloud-meter-arn' },
                        fixasyncvalidation: ''
                    }
                })
            };

            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions } />);

            const data = getListData(wrapper);

            expect(data).toEqual(
                [
                    [ 'Name', 'cosi' ],
                    [ 'Source type', 'Amazon Web Services' ],
                    [ 'Application', 'Subscription Watch' ],
                    [ 'ARN', 'arn:aws:132' ]
                ]
            );
        });

        it('ansible-tower', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower', 'username_password') } />);
            const data = getListData(wrapper);

            expect(data).toEqual(
                [
                    [ 'Name', 'openshift' ],
                    [ 'Source type', 'Ansible Tower' ],
                    [ 'Application', 'Not selected' ],
                    [ 'Authentication type', 'Username and password' ],
                    [ 'Username', 'user_name' ],
                    [ 'Password', '●●●●●●●●●●●●' ],
                    [ 'Hostname', 'neznam.cz' ],
                    [ 'Verify SSL', 'Enabled' ],
                    [ 'Certificate authority', 'authority' ]
                ]
            );

            expect(wrapper.find(Alert)).toHaveLength(0);
        });

        it('selected Catalog application, is second', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower', 'username_password', '1') } />);
            const data = getListData(wrapper);

            expect(data).toEqual(
                [
                    [ 'Name', 'openshift' ],
                    [ 'Source type', 'Ansible Tower' ],
                    [ 'Application', 'Catalog' ],
                    [ 'Hostname', 'neznam.cz' ],
                    [ 'Verify SSL', 'Enabled' ],
                    [ 'Certificate authority', 'authority' ],
                    [ 'Username', 'user_name' ],
                    [ 'Password', '●●●●●●●●●●●●' ]
                ]
            );
        });

        it('hide application', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower', 'username_password', '1') } showApp={ false }/>);
            const data = getListData(wrapper);

            expect(data).toEqual(
                [
                    [ 'Name', 'openshift' ],
                    [ 'Source type', 'Ansible Tower' ],
                    [ 'Hostname', 'neznam.cz' ],
                    [ 'Verify SSL', 'Enabled' ],
                    [ 'Certificate authority', 'authority' ],
                    [ 'Username', 'user_name' ],
                    [ 'Password', '●●●●●●●●●●●●' ]
                ]
            );
            expect(wrapper.contains('Catalog')).toEqual(false);
            expect(wrapper.find(Alert)).toHaveLength(0);
        });

        it('do not contain hidden field', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower', 'username_password') } />);
            expect(wrapper.contains('kubernetes')).toEqual(false);
        });

        it('do not contain hidden field', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower', 'username_password') } />);
            expect(wrapper.contains('kubernetes')).toEqual(false);
        });

        it('do contain endpoint fields when noEndpoint not set', () => {
            formOptions = {
                getState: () => ({
                    values: {
                        source: {
                            name: 'openshift'
                        },
                        source_type: 'openshift',
                        endpoint: {
                            verify_ssl: true,
                            certificate_authority: 'authority'
                        },
                        authentication: {
                            username: 'user_name'
                        }
                    }
                })
            };

            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions } />);
            expect(wrapper.contains('authority')).toEqual(true);
        });

        it('do not contain endpoint fields and authentication when noEndpoint set', () => {
            formOptions = {
                getState: () => ({
                    values: {
                        source: {
                            name: 'openshift'
                        },
                        source_type: 'openshift',
                        application: {
                            application_type_id: COST_MANAGEMENT_APP.id
                        },
                        endpoint: {
                            certificate_authority: 'authority'
                        },
                        authentication: {
                            password: 'token',
                            authtype: 'token'
                        }
                    }
                })
            };

            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions } />);
            expect(wrapper.contains('authority')).toEqual(false);
            expect(wrapper.contains('token')).toEqual(false);
        });

        it('render boolean as Enabled', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('openshift', 'token') } />);
            expect(wrapper.contains('Enabled')).toEqual(true);
            expect(wrapper.contains('Disabled')).toEqual(false);
        });

        it('render boolean as No', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('openshift', 'token', '1', false) } />);
            expect(wrapper.contains('Enabled')).toEqual(false);
            expect(wrapper.contains('Disabled')).toEqual(true);
        });

        it('render password as dots', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower', 'username_password', '1', false) } />);
            expect(wrapper.contains('●●●●●●●●●●●●')).toEqual(true);
            expect(wrapper.contains('123456')).toEqual(false);
        });

        it('use source.source_type_id as a fallback', () => {
            formOptions = {
                getState: () => ({
                    values: {
                        source: {
                            name: 'openshift',
                            source_type_id: '1'
                        }
                    }
                })
            };

            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions } />);
            expect(wrapper.contains('OpenShift Container Platform')).toEqual(true);
        });

        it('contains too long text', () => {
            const randomLongText = new Array(500).fill(1).map(() => String.fromCharCode(Math.random() * (122 - 97) + 97)).join('');

            formOptions = {
                getState: () => ({
                    values: {
                        source: {
                            name: 'openshift'
                        },
                        source_type: 'openshift',
                        endpoint: {
                            certificate_authority: randomLongText,
                            verify_ssl: true
                        }
                    }
                })
            };

            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions } />);
            expect(wrapper.find(ValuePopover).props().value).toEqual(randomLongText);
        });
    });

    describe('createItem', () => {
        let availableStepKeys;
        let field;
        let values;

        beforeEach(() => {
            availableStepKeys = [];
            field = {
                label: 'Label 1',
                name: 'authentication.password'
            };
            values = {
                authentication: {
                    password: '123456'
                }
            };
        });

        it('normal value', () => {
            expect(createItem(field, values, availableStepKeys)).toEqual({
                label: 'Label 1',
                value: '123456'
            });
        });

        it('password value', () => {
            field = {
                label: 'Label 1',
                name: 'authentication.password',
                type: 'password'
            };

            expect(createItem(field, values, availableStepKeys)).toEqual({
                label: 'Label 1',
                value: '●●●●●●●●●●●●'
            });
        });

        it('boolean true', () => {
            values = {
                authentication: {
                    password: true
                }
            };

            expect(createItem(field, values, availableStepKeys)).toEqual({
                label: 'Label 1',
                value: <Label color="green">
                    <FormattedMessage id="wizard.enabled" defaultMessage="Enabled" />
                </Label>
            });
        });

        it('boolean false', () => {
            values = {
                authentication: {
                    password: false
                }
            };

            expect(createItem(field, values, availableStepKeys)).toEqual({
                label: 'Label 1',
                value: <Label color="gray">
                    <FormattedMessage id="wizard.disabled" defaultMessage="Disabled" />
                </Label>
            });
        });

        it('hidden field', () => {
            field = {
                label: 'Label 1',
                name: 'authentication.password',
                hideField: true
            };

            expect(createItem(field, values, availableStepKeys)).toEqual(undefined);
        });

        it('available stepKey', () => {
            field = {
                label: 'Label 1',
                name: 'authentication.password',
                stepKey: 'in'
            };
            availableStepKeys = [ 'in' ];

            expect(createItem(field, values, availableStepKeys)).toEqual({
                label: 'Label 1',
                value: '123456'
            });
        });

        it('unavailableStepKey', () => {
            field = {
                label: 'Label 1',
                name: 'authentication.password',
                stepKey: 'notint'
            };
            availableStepKeys = [ 'in' ];

            expect(createItem(field, values, availableStepKeys)).toEqual(undefined);
        });

        it('empty value', () => {
            values = {};

            expect(createItem(field, values, availableStepKeys)).toEqual({
                label: 'Label 1',
                value: '-'
            });
        });

        it('authentication editing', () => {
            field = {
                label: 'Label 1',
                name: 'authentication.password',
                stepKey: 'in'
            };

            values = {
                authentication: {
                    id: 'someid'
                }
            };

            availableStepKeys = [ 'in' ];

            expect(createItem(field, values, availableStepKeys)).toEqual({
                label: 'Label 1',
                value: '●●●●●●●●●●●●'
            });
        });

        it('hidden conditional field', () => {
            field = {
                label: 'Label 1',
                name: 'authentication.password',
                condition: {
                    when: 'username.name',
                    is: 'lojza'
                }
            };

            values = {
                authentication: {
                    password: '123456'
                },
                username: {
                    name: 'pepa'
                }
            };

            expect(createItem(field, values, availableStepKeys)).toEqual(undefined);
        });
    });
});
