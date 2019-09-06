import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { TextListItem } from '@patternfly/react-core';

import SourceWizardSummary from '../../../sourceFormRenderer/components/SourceWizardSummary';
import applicationTypes from '../../helpers/applicationTypes';

describe('SourceWizardSummary component', () => {
    describe('should render correctly', () => {
        let formOptions;
        let sourceTypes;
        let schema;
        let initialProps;

        beforeEach(() => {
            schema = {
                title: 'Title',
                fields: [
                    {
                        name: 'authentication.username',
                        label: 'Username'
                    },
                    {
                        name: 'endpoint.certificate_authority',
                        label: 'Certificate Authority'
                    },
                    {
                        name: 'url',
                        label: 'URL'
                    },
                    {
                        name: 'authentication.password',
                        label: 'Password',
                        type: 'password'
                    },
                    {
                        name: 'authentication.role',
                        type: 'hidden'
                    },
                    {
                        name: 'authentication.validate',
                        label: 'Should validate?'
                    },
                    {
                        name: 'authentication.extra.tenant',
                        label: 'Tenant Region'
                    }
                ]
            };

            formOptions = (source_type, application_type_id, validate = true) => ({
                getState: () => ({
                    values: {
                        source: {
                            name: 'openshift'
                        },
                        endpoint: {
                            certificate_authority: 'authority'
                        },
                        authentication: {
                            role: 'kubernetes',
                            password: '123456',
                            username: 'user_name',
                            validate,
                            extra: {
                                tenant: 'tenant1234'
                            }
                        },
                        url: 'neznam.cz',
                        source_type,
                        application: {
                            application_type_id
                        }
                    }
                })
            });
            sourceTypes = [
                {
                    id: '1',
                    name: 'openshift',
                    product_name: 'OpenShift Container Platform',
                    schema
                },
                {
                    id: '2',
                    name: 'amazon',
                    product_name: 'Amazon Web Services',
                    schema
                },
                {
                    id: '3',
                    name: 'ansible-tower',
                    product_name: 'Ansible Tower',
                    schema
                }
            ];

            initialProps = {
                sourceTypes,
                applicationTypes
            };
        });

        it('openshift', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('openshift') }/>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('name is first', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('openshift') }/>);
            expect(wrapper.find(TextListItem).at(1).children().first().text()).toEqual('openshift');
        });

        it('type is second', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('openshift') }/>);
            expect(wrapper.find(TextListItem).at(3).children().first().text()).toEqual('OpenShift Container Platform');
        });

        it('amazon', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('amazon') } />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('ansible-tower', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower') } />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('selected Catalog application', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower', '1') } />);
            expect(toJson(wrapper)).toMatchSnapshot();
            expect(wrapper.find(TextListItem).last().children().first().text()).toEqual('Catalog');
        });

        it('do not contain hidden field', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower') } />);
            expect(wrapper.contains('kubernetes')).toEqual(false);
        });

        it('render boolean as Yes', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower') } />);
            expect(wrapper.contains('Yes')).toEqual(true);
            expect(wrapper.contains('No')).toEqual(false);
        });

        it('render boolean as No', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower', '1', false) } />);
            expect(wrapper.contains('No')).toEqual(true);
            expect(wrapper.contains('Yes')).toEqual(false);
        });

        it('render password as dots', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower', '1', false) } />);
            expect(wrapper.contains('●●●●●●●●●●●●')).toEqual(true);
            expect(wrapper.contains('123456')).toEqual(false);
        });
    });
});
