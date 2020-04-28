import React from 'react';
import { mount } from 'enzyme';
import { Radio, FormHelperText } from '@patternfly/react-core';

import FormRenderer from '@data-driven-forms/react-form-renderer/dist/cjs/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';

import AuthSelect from '../../../sourceFormRenderer/components/AuthSelect';

describe('AuthSelect component', () => {
    let initialProps;
    let onSubmit;

    const componentMapper = {
        'auth-select': AuthSelect
    };

    beforeEach(() => {
        onSubmit = jest.fn();
        initialProps = {
            onSubmit: (values) => onSubmit(values),
            componentMapper,
            FormTemplate,
            schema: {
                fields: [{
                    component: 'auth-select',
                    label: 'Test',
                    name: 'auth-select',
                    authName: 'access_key_secret_key'
                }]
            }
        };
    });

    it('renders correctly', () => {
        const wrapper = mount(<FormRenderer { ...initialProps }/>);

        expect(wrapper.find(Radio)).toHaveLength(1);
        expect(wrapper.find(FormHelperText)).toHaveLength(0);
    });

    it('renders correctly when disableAuthType', () => {
        initialProps = {
            ...initialProps,
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    disableAuthType: true
                }]
            }
        };

        const wrapper = mount(<FormRenderer { ...initialProps }/>);

        expect(wrapper.find(Radio)).toHaveLength(1);
        expect(wrapper.find(FormHelperText)).toHaveLength(1);
    });

    it('calls onChange correctly', () => {
        const wrapper = mount(<FormRenderer { ...initialProps }/>);

        wrapper.find('form').simulate('submit');

        expect(onSubmit).toHaveBeenCalledWith({});

        wrapper.find('input').simulate('change');

        wrapper.find('form').simulate('submit');

        expect(onSubmit).toHaveBeenCalledWith({});
    });

    it('renders correctly when editing', () => {
        initialProps = {
            ...initialProps,
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    disableAuthType: true
                }]
            }
        };

        const wrapper = mount(<FormRenderer { ...initialProps }/>);

        expect(wrapper.find(Radio)).toHaveLength(1);
        expect(wrapper.find(FormHelperText)).toHaveLength(1);
    });

    it('reset the value when unsupported auth type for application is selected', () => {
        initialProps = {
            ...initialProps,
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    supportedAuthTypes: [ 'arn' ]
                }]
            }
        };

        const wrapper = mount(<FormRenderer { ...initialProps } initialValues={{ 'auth-select': 'access_key_secret_key' }}/>);

        wrapper.find('form').simulate('submit');

        expect(onSubmit).toHaveBeenCalledWith({});
    });
});
