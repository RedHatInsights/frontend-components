import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { TextListItem } from '@patternfly/react-core';

import SourceWizardSummary, { createItem } from '../../../sourceFormRenderer/components/SourceWizardSummary';
import applicationTypes from '../../helpers/applicationTypes';
import sourceTypes from '../../helpers/sourceTypes';

describe('SourceWizardSummary component', () => {
    describe('should render correctly', () => {
        let formOptions;
        let initialProps;

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
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('openshift', 'token') }/>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('name is first', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('openshift', 'token') }/>);
            expect(wrapper.find(TextListItem).at(1).children().first().text()).toEqual('openshift');
        });

        it('type is third', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('openshift', 'token') }/>);
            expect(wrapper.find(TextListItem).at(5).children().first().text()).toEqual('OpenShift Container Platform');
        });

        it('amazon', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('amazon', 'access_key_secret_key') } />);
            expect(toJson(wrapper)).toMatchSnapshot();

            // use labels from hardcoded schemas
            expect(wrapper.contains('Access Key')).toEqual(false);
            expect(wrapper.contains('Secret Key')).toEqual(false);
            expect(wrapper.contains('Access key ID')).toEqual(true);
            expect(wrapper.contains('Secret access key')).toEqual(true);
        });

        it('amazon - ARN', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('amazon', 'arn') } />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('ansible-tower', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower', 'username_password') } />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('selected Catalog application, is second', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower', 'username_password', '1') } />);
            expect(toJson(wrapper)).toMatchSnapshot();
            expect(wrapper.find(TextListItem).at(3).children().first().text()).toEqual('Catalog');
        });

        it('hide application', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower', 'username_password', '1') } showApp={ false }/>);
            expect(toJson(wrapper)).toMatchSnapshot();
            expect(wrapper.find(TextListItem).at(3).children().first().text()).not.toEqual('Catalog');
            expect(wrapper.contains('Catalog')).toEqual(false);
        });

        it('do not contain hidden field', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower', 'username_password') } />);
            expect(wrapper.contains('kubernetes')).toEqual(false);
        });

        it('do not contain hidden field', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower', 'username_password') } />);
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
                        },
                        noEndpoint: false
                    }
                })
            };

            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions } />);
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
                        endpoint: {
                            certificate_authority: 'authority'
                        },
                        authentication: {
                            password: 'token'
                        },
                        noEndpoint: true
                    }
                })
            };

            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions } />);
            expect(wrapper.contains('authority')).toEqual(false);
            expect(wrapper.contains('token')).toEqual(false);
        });

        it('render boolean as Yes', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('openshift', 'token') } />);
            expect(wrapper.contains('Yes')).toEqual(true);
            expect(wrapper.contains('No')).toEqual(false);
        });

        it('render boolean as No', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('openshift', 'token', '1', false) } />);
            expect(wrapper.contains('No')).toEqual(true);
            expect(wrapper.contains('Yes')).toEqual(false);
        });

        it('render password as dots', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower', 'username_password', '1', false) } />);
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
                        },
                        noEndpoint: true
                    }
                })
            };

            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions } />);
            expect(wrapper.contains('OpenShift Container Platform')).toEqual(true);
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
                value: 'Yes'
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
                value: 'No'
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
