import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import SourceWizardSummary from '../../../sourceFormRenderer/components/SourceWizardSummary';

describe('SourceWizardSummary component', () => {
    describe('should render correctly', () => {
        let formOptions;
        let sourceTypes;
        let schema;

        beforeEach(() => {
            schema = {
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

            formOptions = (source_type) => ({
                getState: () => ({
                    values: {
                        source_name: 'openshift',
                        username: 'user_name',
                        certificate_authority: 'authority',
                        url: 'neznam.cz',
                        password: '123456',
                        source_type,
                        role: 'kubernetes',
                        validate: true
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
        });

        it('openshift', () => {
            const wrapper = shallow(<SourceWizardSummary formOptions={ formOptions('openshift') } sourceTypes={ sourceTypes }/>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('amazon', () => {
            const wrapper = shallow(<SourceWizardSummary formOptions={ formOptions('amazon') } sourceTypes={ sourceTypes }/>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('ansible-tower', () => {
            const wrapper = shallow(<SourceWizardSummary formOptions={ formOptions('ansible-tower') } sourceTypes={ sourceTypes }/>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});
