import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import { FormGroup, Switch } from '@patternfly/react-core';

import FormRenderer from '@data-driven-forms/react-form-renderer/dist/esm/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';

import SwitchGroup from '../../../sourceFormRenderer/components/SwitchGroup';

describe('Switch group', () => {
    let onSubmit;
    let initialProps;
    let wrapper;

    beforeEach(() => {
        onSubmit = jest.fn();

        initialProps = {
            subscription: { values: true },
            onSubmit: ({ source_type, ...values }) => onSubmit(values),
            FormTemplate,
            componentMapper: {
                'switch-group': SwitchGroup
            },
            initialValues: { source_type: 'selected_type' },
            schema: {
                fields: [{
                    component: 'switch-group',
                    name: 'switch-group',
                    label: 'Some label here',
                    options: [
                        { label: 'App 1', value: '1' },
                        { label: 'App 2', value: '2', description: <span id="some-description">some description</span> },
                        { label: 'UnsupportedApp', value: '3' },
                        { label: 'Empty value - do not show me' }
                    ],
                    applicationTypes: [
                        { id: '1', supported_source_types: [ 'selected_type' ] },
                        { id: '2', supported_source_types: [ 'selected_type' ] },
                        { id: '3', supported_source_types: [] }
                    ]
                }]
            }
        };
    });

    it('renders correctly, filters apptypes and sets values on initial', async () => {
        await act(async () => {
            wrapper = mount(<FormRenderer {...initialProps}/>);
        });
        wrapper.update();

        expect(wrapper.find(FormGroup).props().label).toEqual('Some label here');
        expect(wrapper.find(Switch)).toHaveLength(2);

        expect(wrapper.find(Switch).first().text()).toEqual('App 1App 1');
        expect(wrapper.find(Switch).first().props().isChecked).toEqual(true);

        expect(wrapper.find(Switch).last().text()).toEqual('App 2App 2');
        expect(wrapper.find(Switch).last().props().isChecked).toEqual(true);

        expect(wrapper.find('.ins-c-sources__wizard--switch-description').text()).toEqual('some description');

        await act(async() => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        expect(onSubmit).toHaveBeenCalledWith({ 'switch-group': [ '1', '2' ] });
    });

    it('do not set initial when values exist', async () => {
        await act(async () => {
            wrapper = mount(<FormRenderer {...initialProps} initialValues={{ 'switch-group': '123' }}/>);
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        expect(onSubmit).toHaveBeenCalledWith({ 'switch-group': '123' });
    });

    it('handle onChange', async () => {
        await act(async () => {
            wrapper = mount(<FormRenderer {...initialProps}/>);
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('input').first().simulate('change', { target: { checked: false } });
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        expect(onSubmit).toHaveBeenCalledWith({ 'switch-group': [ '2' ] });
        onSubmit.mockClear();

        await act(async() => {
            wrapper.find('input').last().simulate('change', { target: { checked: false } });
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        expect(onSubmit).toHaveBeenCalledWith({ 'switch-group': [] });
        onSubmit.mockClear();

        await act(async() => {
            wrapper.find('input').last().simulate('change', { target: { checked: true } });
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        expect(onSubmit).toHaveBeenCalledWith({ 'switch-group': [ '2' ] });
        onSubmit.mockClear();

        await act(async() => {
            wrapper.find('input').first().simulate('change', { target: { checked: true } });
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        expect(onSubmit).toHaveBeenCalledWith({ 'switch-group': [ '2', '1' ] });
        onSubmit.mockClear();
    });
});
