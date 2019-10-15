import React from 'react';
import { mount } from 'enzyme';
import { Radio, FormHelperText } from '@patternfly/react-core';

import AuthSelect from '../../../sourceFormRenderer/components/AuthSelect';
import FieldProvider from '../../__mocks__/FieldProvider';
import applicationTypes from '../../helpers/applicationTypes';
import sourceTypes from '../../helpers/sourceTypes';

describe('AuthSelect component', () => {
    let initialProps;
    let spyOnChange;

    beforeEach(() => {
        spyOnChange = jest.fn();
        initialProps = {
            applicationTypes,
            sourceTypes,
            FieldProvider,
            input: {
                name: 'auth-select',
                onChange: spyOnChange
            },
            formOptions: {
                getState: () => ({
                    values: {
                        source_type: 'amazon'
                    }
                })
            },
            label: 'Test',
            name: 'auth-select',
            authName: 'access_key_secret_key',
            index: 0,
            authsCount: 2
        };
    });

    afterEach(() => {
        spyOnChange.mockReset();
    });

    it('renders correctly', () => {
        const wrapper = mount(<AuthSelect { ...initialProps }/>);

        expect(wrapper.find(Radio)).toHaveLength(1);
        expect(wrapper.find(FormHelperText)).toHaveLength(0);
    });

    it('renders correctly when disableAuthType', () => {
        const wrapper = mount(<AuthSelect { ...initialProps } disableAuthType/>);

        expect(wrapper.find(Radio)).toHaveLength(1);
        expect(wrapper.find(FormHelperText)).toHaveLength(1);
    });

    it('calls onChange correctly', () => {
        const wrapper = mount(<AuthSelect { ...initialProps }/>);

        expect(spyOnChange).not.toHaveBeenCalled();

        wrapper.find('input').simulate('change');

        expect(spyOnChange).toHaveBeenCalledWith(initialProps.authName);
    });

    it('calls onChange after render, when only one authtype is available', () => {
        const OPENSHIFT_FORM_OPTIONS = {
            getState: () => ({
                values: {
                    source_type: 'openshift'
                }
            })
        };
        const OPENSHIFT_AUTH_NAME = 'token';

        mount(<AuthSelect { ...initialProps } formOptions={OPENSHIFT_FORM_OPTIONS} authName={OPENSHIFT_AUTH_NAME} authsCount={1}/>);
        expect(spyOnChange).toHaveBeenCalledWith(OPENSHIFT_AUTH_NAME);
    });

    it('renders correctly with unsupported application', () => {
        initialProps = {
            ...initialProps,
            formOptions: {
                getState: () => ({
                    values: {
                        source_type: 'amazon',
                        application: {
                            application_type_id: '2'
                        }
                    }
                })
            }
        };
        const wrapper = mount(<AuthSelect { ...initialProps }/>);

        expect(wrapper.find(Radio)).toHaveLength(1);
        expect(wrapper.find(FormHelperText)).toHaveLength(1);
    });

    it('reset the value when unsupported/not-existent auth type is selected', () => {
        initialProps = {
            ...initialProps,
            input: {
                ...initialProps.input,
                value: 'username_password'
            }
        };
        mount(<AuthSelect { ...initialProps }/>);

        expect(spyOnChange).toHaveBeenCalledWith(undefined);
    });

    it('reset the value when unsupported auth type for application is selected', () => {
        initialProps = {
            ...initialProps,
            formOptions: {
                getState: () => ({
                    values: {
                        source_type: 'amazon',
                        application: {
                            application_type_id: '2'
                        }
                    }
                })
            },
            input: {
                ...initialProps.input,
                value: 'access_key_secret_key'
            }
        };
        mount(<AuthSelect { ...initialProps }/>);

        expect(spyOnChange).toHaveBeenCalledWith(undefined);
    });
});
