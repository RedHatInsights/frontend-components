import React from 'react';
import { mount } from 'enzyme';
import CardSelect from '../../../sourceFormRenderer/components/CardSelect';
import { Card, CardHeader } from '@patternfly/react-core';
import { AwsIcon, OpenshiftIcon } from '@patternfly/react-icons';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/cjs/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';

describe('CardSelect component', () => {
    let initialProps;
    let onSubmit;

    const componentMapper = {
        'card-select': CardSelect
    };

    beforeEach(() => {
        onSubmit = jest.fn();
        initialProps = {
            initialValues: {
                pre: 'filled'
            },
            onSubmit: (values) => onSubmit(values),
            componentMapper,
            FormTemplate,
            schema: {
                fields: [{
                    component: 'card-select',
                    name: 'card-select',
                    options: [
                        { value: 'ops', label: 'openshift' },
                        { value: 'aws', label: 'aws' },
                        { label: 'Choose one (this should not be displayed)' }
                    ]
                }]
            }
        };
    });

    it('should render correctly', () => {
        const wrapper = mount(<FormRenderer { ...initialProps }/>);

        expect(wrapper.find(Card).length).toEqual(2);
        expect(wrapper.find(CardHeader).length).toEqual(2);
        expect(wrapper.find(CardHeader).first().text()).toEqual('openshift');
        expect(wrapper.find(CardHeader).last().text()).toEqual('aws');
    });

    it('should render correctly with mutator and it passes formOptions', () => {
        initialProps = {
            ...initialProps,
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    mutator: ({ label, value }, formOptions) => ({ label: `AAA-${label}-${formOptions.getState().values.pre}`, value })
                }]
            }
        };

        const wrapper = mount(<FormRenderer { ...initialProps } />);

        expect(wrapper.find(Card).length).toEqual(2);
        expect(wrapper.find(CardHeader).length).toEqual(2);
        expect(wrapper.find(CardHeader).first().text()).toEqual('AAA-openshift-filled');
        expect(wrapper.find(CardHeader).last().text()).toEqual('AAA-aws-filled');
    });

    it('should render correctly with default icon', () => {
        initialProps = {
            ...initialProps,
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    DefaultIcon: AwsIcon
                }]
            }
        };

        const wrapper = mount(<FormRenderer { ...initialProps } />);

        expect(wrapper.find(AwsIcon).length).toEqual(2);
    });

    it('should render correctly one item disabled', () => {
        initialProps = {
            ...initialProps,
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    options: [
                        ...initialProps.schema.fields[0].options,
                        { value: 'azure', label: 'MS Azure', isDisabled: true }
                    ]
                }]
            }
        };

        const wrapper = mount(
            <FormRenderer { ...initialProps }/>
        );

        expect(wrapper.find(Card).last().props().className.includes('disabled')).toEqual(true);
    });

    it('should render correctly with iconMapper', () => {
        const iconMapper = (value, defaultIcon) => ({
            aws: AwsIcon,
            ops: OpenshiftIcon
        }[value] || defaultIcon);

        initialProps = {
            ...initialProps,
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    iconMapper
                }]
            }
        };

        const wrapper = mount(<FormRenderer { ...initialProps }/>);

        expect(wrapper.find(AwsIcon).length).toEqual(1);
        expect(wrapper.find(OpenshiftIcon).length).toEqual(1);
    });

    it('should set default value', () => {
        const wrapper = mount(<FormRenderer { ...initialProps } initialValues={ { 'card-select': 'ops' } }/>);

        // value is set, we click on the card and check if clicking on it will unselect it
        wrapper.find(Card).first().simulate('click');

        wrapper.find('form').simulate('submit');

        expect(onSubmit).toHaveBeenCalledWith({});
    });

    it('should clicked single select', () => {
        const wrapper = mount(<FormRenderer { ...initialProps }/>);

        wrapper.find(Card).first().simulate('click');

        wrapper.find('form').simulate('submit');

        expect(onSubmit).toHaveBeenCalledWith({
            pre: 'filled',
            'card-select': 'ops'
        });
    });

    it('should change by pressing enter single select', () => {
        const wrapper = mount(<FormRenderer { ...initialProps }/>);

        const preventDefaultMock = jest.fn();
        wrapper.find(Card).last().simulate('keypress', { charCode: 32, preventDefault: preventDefaultMock });
        wrapper.update();

        expect(preventDefaultMock).toHaveBeenCalled();

        wrapper.find('form').simulate('submit');

        expect(onSubmit).toHaveBeenCalledWith({
            pre: 'filled',
            'card-select': 'aws'
        });

        // unselect
        wrapper.find(Card).last().simulate('keypress', { charCode: 32 });
        wrapper.update();

        wrapper.find('form').simulate('submit');

        expect(onSubmit).toHaveBeenCalledWith({
            pre: 'filled'
        });
    });

    it('should not change by pressing shift single select', () => {
        const wrapper = mount(<FormRenderer { ...initialProps }/>);

        wrapper.find(Card).last().simulate('keypress', { key: 'Shift' });

        wrapper.find('form').simulate('submit');

        expect(onSubmit).toHaveBeenCalledWith({
            pre: 'filled'
        });
    });

    it('should not clicked disabled', () => {
        initialProps = {
            ...initialProps,
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    isDisabled: true
                }]
            }
        };

        const wrapper = mount(<FormRenderer { ...initialProps } />);

        wrapper.find(Card).first().simulate('click');

        wrapper.find('form').simulate('submit');

        expect(onSubmit).toHaveBeenCalledWith({
            pre: 'filled'
        });
    });

    it('should clicked multiSelect select', () => {
        initialProps = {
            ...initialProps,
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    isMulti: true
                }]
            }
        };

        const wrapper = mount(<FormRenderer { ...initialProps } />);

        wrapper.find(Card).first().simulate('click');
        wrapper.update();

        wrapper.find(Card).last().simulate('click');
        wrapper.update();

        wrapper.find('form').simulate('submit');

        expect(onSubmit).toHaveBeenCalledWith({
            pre: 'filled',
            'card-select': [ 'ops', 'aws' ]
        });

        // unselect
        wrapper.update();
        wrapper.find(Card).first().simulate('click');

        wrapper.find('form').simulate('submit');

        expect(onSubmit).toHaveBeenCalledWith({
            pre: 'filled',
            'card-select': [ 'aws' ]
        });
    });
});
