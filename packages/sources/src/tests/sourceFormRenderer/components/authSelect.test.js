import React from 'react';
import { mount } from 'enzyme';
import { Radio, FormHelperText } from '@patternfly/react-core';

import AuthSelect from '../../../sourceFormRenderer/components/AuthSelect';
import FieldProvider from '../../__mocks__/FieldProvider';

describe('AuthSelect component', () => {
    let initialProps;
    let spyOnChange;

    beforeEach(() => {
        spyOnChange = jest.fn();
        initialProps = {
            FieldProvider,
            input: {
                name: 'auth-select',
                onChange: spyOnChange
            },
            label: 'Test',
            name: 'auth-select',
            authName: 'access_key_secret_key'
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

    it('renders correctly when editing', () => {
        initialProps = {
            ...initialProps,
            disableAuthType: true
        };
        const wrapper = mount(<AuthSelect { ...initialProps }/>);

        expect(wrapper.find(Radio)).toHaveLength(1);
        expect(wrapper.find(FormHelperText)).toHaveLength(1);
    });

    it('reset the value when unsupported auth type for application is selected', () => {
        initialProps = {
            ...initialProps,
            input: {
                ...initialProps.input,
                value: 'access_key_secret_key'
            },
            supportedAuthTypes: [ 'arn' ]
        };
        mount(<AuthSelect { ...initialProps }/>);

        expect(spyOnChange).toHaveBeenCalledWith(undefined);
    });
});
