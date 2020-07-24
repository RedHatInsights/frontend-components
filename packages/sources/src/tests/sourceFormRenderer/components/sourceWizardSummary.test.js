import React from 'react';
import toJson from 'enzyme-to-json';
import { TextListItem, TextContent } from '@patternfly/react-core';

import Summary, { createItem } from '../../../sourceFormRenderer/components/SourceWizardSummary';
import applicationTypes, { COST_MANAGEMENT_APP } from '../../helpers/applicationTypes';
import sourceTypes from '../../helpers/sourceTypes';
import ValuePopover from '../../../sourceFormRenderer/components/ValuePopover';
import RendererContext from '@data-driven-forms/react-form-renderer/dist/cjs/renderer-context';
import mount from '../../__mocks__/mount';
import { FormattedMessage } from 'react-intl';

describe('SourceWizardSummary component', () => {
    describe('should render correctly', () => {
        let formOptions;
        let initialProps;

        const SourceWizardSummary = ({ formOptions, ...props }) => (
            <RendererContext.Provider value={{ formOptions }}>
                <Summary {...props} />
            </RendererContext.Provider>
        );

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
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('openshift', 'token') }/>);
            expect(toJson(wrapper.find(TextContent))).toMatchSnapshot();
        });

        it('name is first', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('openshift', 'token') }/>);
            expect(wrapper.find(TextListItem).at(1).children().first().text()).toEqual('openshift');
        });

        it('type is third', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('openshift', 'token') }/>);
            expect(wrapper.find(TextListItem).at(5).children().first().text()).toEqual('OpenShift Container Platform');
        });

        it('amazon', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('amazon', 'access_key_secret_key') } />);
            expect(toJson(wrapper.find(TextContent))).toMatchSnapshot();

            // use labels from hardcoded schemas
            expect(wrapper.contains('Access Key')).toEqual(false);
            expect(wrapper.contains('Secret Key')).toEqual(false);
            expect(wrapper.contains('Access key ID')).toEqual(true);
            expect(wrapper.contains('Secret access key')).toEqual(true);
        });

        it('amazon - ARN', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('amazon', 'arn') } />);
            expect(toJson(wrapper.find(TextContent))).toMatchSnapshot();
        });

        it('amazon - ARN cost management - include appended field from DB', () => {
            formOptions = {
                getState: () => ({
                    values: {
                        source: { name: 'cosi' },
                        application: { application_type_id: '2' },
                        source_type: 'amazon',
                        authentication: { password: 'arn:aws:132', authtype: 'arn' },
                        billing_source: { bucket: 'gfghf' },
                        fixasyncvalidation: '',
                        endpoint: { role: 'aws' }
                    }
                })
            };

            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions } />);
            expect(toJson(wrapper.find(TextContent))).toMatchSnapshot();

            expect(wrapper.find(TextContent).html().includes('ARN')).toEqual(true);
            expect(wrapper.find(TextContent).html().includes('arn:aws:132')).toEqual(true);
        });

        it('openshift cost management - include appended field from DB', () => {
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
            expect(toJson(wrapper.find(TextContent))).toMatchSnapshot();

            expect(wrapper.find(TextContent).find({ defaultMessage: 'Cluster Identifier' })).toHaveLength(1);
            expect(wrapper.find(TextContent).html().includes('CLUSTER ID123')).toEqual(true);
        });

        it('ansible-tower', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower', 'username_password') } />);
            expect(toJson(wrapper.find(TextContent))).toMatchSnapshot();
        });

        it('selected Catalog application, is second', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower', 'username_password', '1') } />);
            expect(toJson(wrapper.find(TextContent))).toMatchSnapshot();
            expect(wrapper.find(TextListItem).at(3).children().first().text()).toEqual('Catalog');
        });

        it('hide application', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower', 'username_password', '1') } showApp={ false }/>);
            expect(toJson(wrapper.find(TextContent))).toMatchSnapshot();
            expect(wrapper.find(TextListItem).at(3).children().first().text()).not.toEqual('Catalog');
            expect(wrapper.contains('Catalog')).toEqual(false);
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

        it('render boolean as Yes', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('openshift', 'token') } />);
            expect(wrapper.contains('Yes')).toEqual(true);
            expect(wrapper.contains('No')).toEqual(false);
        });

        it('render boolean as No', () => {
            const wrapper = mount(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('openshift', 'token', '1', false) } />);
            expect(wrapper.contains('No')).toEqual(true);
            expect(wrapper.contains('Yes')).toEqual(false);
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
                value: <FormattedMessage id="wizard.yes" defaultMessage="Yes" />
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
                value: <FormattedMessage id="wizard.no" defaultMessage="No" />
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
