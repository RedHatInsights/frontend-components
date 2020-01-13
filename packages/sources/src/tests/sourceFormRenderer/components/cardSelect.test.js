import React from 'react';
import { mount } from 'enzyme';
import CardSelect from '../../../sourceFormRenderer/components/CardSelect';
import FieldProvider from '../../__mocks__/FieldProvider';
import { Card, CardHeader } from '@patternfly/react-core';
import { AwsIcon, OpenshiftIcon } from '@patternfly/react-icons';

describe('CardSelect component', () => {
    let initialProps;
    let spyOnChange;
    let spyOnBlur;

    beforeEach(() => {
        spyOnChange = jest.fn();
        spyOnBlur = jest.fn();
        initialProps = {
            FieldProvider,
            options: [
                { value: 'ops', label: 'openshift' },
                { value: 'aws', label: 'aws' },
                { label: 'Choose one (this should not be displayed)' }
            ],
            input: {
                name: 'card-select',
                onChange: spyOnChange,
                onBlur: spyOnBlur
            },
            formOptions: {
                something: '1'
            }
        };
    });

    afterEach(() => {
        spyOnChange.mockReset();
        spyOnBlur.mockReset();
    });

    it('should render correctly', () => {
        const wrapper = mount(<CardSelect { ...initialProps }/>);

        expect(wrapper.find(Card).length).toEqual(2);
        expect(wrapper.find(CardHeader).length).toEqual(2);
        expect(wrapper.find(CardHeader).first().text()).toEqual('openshift');
        expect(wrapper.find(CardHeader).last().text()).toEqual('aws');
    });

    it('should render correctly with mutator and it passes formOptions', () => {
        const wrapper = mount(<CardSelect { ...initialProps } mutator={ ({ label, value }, formOptions) => ({ label: `AAA-${label}-${formOptions.something}`, value }) }/>);

        expect(wrapper.find(Card).length).toEqual(2);
        expect(wrapper.find(CardHeader).length).toEqual(2);
        expect(wrapper.find(CardHeader).first().text()).toEqual('AAA-openshift-1');
        expect(wrapper.find(CardHeader).last().text()).toEqual('AAA-aws-1');
    });

    it('should render correctly with default icon', () => {
        const wrapper = mount(<CardSelect { ...initialProps } DefaultIcon={ AwsIcon }/>);

        expect(wrapper.find(AwsIcon).length).toEqual(2);
    });

    it('should render correctly one item disabled', () => {
        const wrapper = mount(
            <CardSelect { ...initialProps } options={ [ ...initialProps.options, { value: 'azure', label: 'MS Azure', isDisabled: true }] }/>
        );

        expect(wrapper.find(Card).last().props().className.includes('disabled')).toEqual(true);
    });

    it('should render correctly with iconMapper', () => {
        const iconMapper = (value, defaultIcon) => ({
            aws: AwsIcon,
            ops: OpenshiftIcon
        }[value] || defaultIcon);

        const wrapper = mount(<CardSelect { ...initialProps } iconMapper={ iconMapper }/>);

        expect(wrapper.find(AwsIcon).length).toEqual(1);
        expect(wrapper.find(OpenshiftIcon).length).toEqual(1);
    });

    it('should set default value', () => {
        const wrapper = mount(<CardSelect { ...initialProps } input={ { ...initialProps.input, value: 'ops' } }/>);

        // value is set, we click on the card and check if clicking on it will unselect it
        wrapper.find(Card).first().simulate('click');

        expect(spyOnChange).toHaveBeenCalledWith(undefined);
    });

    it('should clicked single select', () => {
        const wrapper = mount(<CardSelect { ...initialProps }/>);

        wrapper.find(Card).first().simulate('click');

        expect(spyOnChange).toHaveBeenCalledWith('ops');
        expect(spyOnBlur).toHaveBeenCalled();
    });

    it('should change by pressing enter single select', () => {
        const wrapper = mount(<CardSelect { ...initialProps }/>);

        const preventDefaultMock = jest.fn();
        wrapper.find(Card).last().simulate('keypress', { charCode: 32, preventDefault: preventDefaultMock });

        expect(spyOnChange).toHaveBeenCalledWith('aws');
        expect(spyOnBlur).toHaveBeenCalled();
        expect(preventDefaultMock).toHaveBeenCalled();

        // unselect
        wrapper.find(Card).last().simulate('keypress', { charCode: 32 });
        expect(spyOnChange).toHaveBeenCalledWith(undefined);
    });

    it('should not change by pressing enter single select', () => {
        const wrapper = mount(<CardSelect { ...initialProps }/>);

        wrapper.find(Card).last().simulate('keypress', { key: 'Shift' });

        expect(spyOnChange).not.toHaveBeenCalledWith();
        expect(spyOnBlur).not.toHaveBeenCalled();
    });

    it('should not clicked disabled', () => {
        const wrapper = mount(<CardSelect { ...initialProps } isDisabled/>);

        wrapper.find(Card).first().simulate('click');

        expect(spyOnChange).not.toHaveBeenCalled();
        expect(spyOnBlur).not.toHaveBeenCalled();
    });

    it('should clicked multiSelect select', () => {
        let formState;

        const onChange = (value) => formState = value;

        const wrapper = mount(<CardSelect { ...initialProps } isMulti input={ { ...initialProps.input, onChange } }/>);

        wrapper.find(Card).first().simulate('click');
        wrapper.find(Card).last().simulate('click');

        expect(formState).toEqual([ 'ops', 'aws' ]);

        // unselect
        wrapper.update();
        wrapper.find(Card).first().simulate('click');

        expect(formState).toEqual([ 'aws' ]);
    });
});
