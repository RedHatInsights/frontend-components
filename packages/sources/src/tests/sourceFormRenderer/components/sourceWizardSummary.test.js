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
                        name: 'username',
                        label: 'Username'
                    },
                    {
                        name: 'certificate_authority',
                        label: 'Certificate Authority'
                    },
                    {
                        name: 'url',
                        label: 'URL'
                    },
                    {
                        name: 'password',
                        label: 'Password'
                    },
                    {
                        name: 'role',
                        type: 'hidden'
                    },
                    {
                        name: 'validate',
                        label: 'Should validate?'
                    }
                ]
            };

            formOptions = (source_type, app_type) => ({
                getState: () => ({
                    values: {
                        source_name: 'openshift',
                        username: 'user_name',
                        certificate_authority: 'authority',
                        url: 'neznam.cz',
                        password: '123456',
                        source_type,
                        role: 'kubernetes',
                        validate: true,
                        app_type
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
        });
    });
});
