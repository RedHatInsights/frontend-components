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
                        source_type: 'amazon' //eslint-disable-line camelcase
                    }
                })
            },
            label: 'Test',
            name: 'auth-select',
            authName: 'access_key_secret_key',
            index: 0
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

    it('calls onChange correctly', () => {
        const wrapper = mount(<AuthSelect { ...initialProps }/>);

        expect(spyOnChange).not.toHaveBeenCalled();

        wrapper.find('input').simulate('change');

        expect(spyOnChange).toHaveBeenCalledWith(initialProps.authName);
    });

    it('renders correctly with unsupported application', () => {
        initialProps = {
            ...initialProps,
            formOptions: {
                getState: () => ({
                    values: {
                        source_type: 'amazon', //eslint-disable-line camelcase
                        application: {
                            application_type_id: '2' //eslint-disable-line camelcase
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
                        source_type: 'amazon', //eslint-disable-line camelcase
                        application: {
                            application_type_id: '2' //eslint-disable-line camelcase
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
