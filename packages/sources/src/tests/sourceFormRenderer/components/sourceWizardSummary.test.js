/* eslint-disable camelcase */
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { TextListItem } from '@patternfly/react-core';

import SourceWizardSummary from '../../../sourceFormRenderer/components/SourceWizardSummary';
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

        it('type is fourth', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('openshift', 'token') }/>);
            expect(wrapper.find(TextListItem).at(7).children().first().text()).toEqual('OpenShift Container Platform');
        });

        it('amazon', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('amazon', 'access_key_secret_key') } />);
            expect(toJson(wrapper)).toMatchSnapshot();
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
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower','username_password', '1') } showApp={ false }/>);
            expect(toJson(wrapper)).toMatchSnapshot();
            expect(wrapper.find(TextListItem).at(3).children().first().text()).not.toEqual('Catalog');
            expect(wrapper.contains('Catalog')).toEqual(false);
        });

        it('do not contain hidden field', () => {
            const wrapper = shallow(<SourceWizardSummary { ...initialProps } formOptions={ formOptions('ansible-tower', 'username_password') } />);
            expect(wrapper.contains('kubernetes')).toEqual(false);
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
    });
});
