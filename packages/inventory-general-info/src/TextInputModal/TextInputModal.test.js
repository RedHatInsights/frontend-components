/* eslint-disable camelcase */
import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import TextInputModal from './TextInputModal';

describe('TextInputModal', () => {
    describe('getDerivedStateFromProps', () => {
        it('should set state value to undefined', () => {
            expect(TextInputModal.getDerivedStateFromProps({
                isOpen: false,
                value: 'some-value'
            }, { value: 'test' })).toEqual({
                value: undefined
            });
        });

        it('should keep the value same if isOpen set and state value set', () => {
            expect(TextInputModal.getDerivedStateFromProps({
                isOpen: true,
                value: 'some-value'
            }, { value: 'test' })).toBe(null);
        });

        it('should set the state value', () => {
            expect(TextInputModal.getDerivedStateFromProps({
                isOpen: true,
                value: 'some-value'
            }, { value: undefined })).toEqual({
                value: 'some-value'
            });
        });
    });

    describe('render', () => {
        it('should render without any props', () => {
            const wrapper = shallow(<TextInputModal />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render open', () => {
            const wrapper = shallow(<TextInputModal isOpen />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render title', () => {
            const wrapper = shallow(<TextInputModal isOpen title='Some title' />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render aria label', () => {
            const wrapper = shallow(<TextInputModal isOpen ariaLabel='Some aria label' />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe('API', () => {
        it('getDerivedStateFromProps should be called', () => {
            const getDerivedStateFromProps = jest.spyOn(TextInputModal, 'getDerivedStateFromProps');
            const wrapper = mount(<TextInputModal isOpen />);
            wrapper.find('input[type="text"]').first().simulate('change', { target: { value: 'some' } });
            expect(getDerivedStateFromProps).toHaveBeenCalled();
        });

        it('onCancel should NOT be called', () => {
            const onCancel = jest.fn();
            const wrapper = mount(<TextInputModal isOpen/>);
            wrapper.find('button[data-action="cancel"]').first().simulate('click');
            expect(onCancel).not.toHaveBeenCalled();
        });

        it('onCancel should be called', () => {
            const onCancel = jest.fn();
            const wrapper = mount(<TextInputModal isOpen onCancel={ onCancel }/>);
            wrapper.find('button[data-action="cancel"]').first().simulate('click');
            expect(onCancel).toHaveBeenCalled();
        });

        it('onSubmit should NOT be called', () => {
            const onSubmit = jest.fn();
            const wrapper = mount(<TextInputModal isOpen/>);
            wrapper.find('button[data-action="confirm"]').first().simulate('click');
            expect(onSubmit).not.toHaveBeenCalled();
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('onSubmit should NOT be called', () => {
            const onSubmit = jest.fn();
            const wrapper = mount(<TextInputModal isOpen onSubmit={ onSubmit }/>);
            wrapper.find('button[data-action="confirm"]').first().simulate('click');
            expect(onSubmit).toHaveBeenCalled();
        });

        it('X button should call onClose', () => {
            const onCancel = jest.fn();
            const wrapper = mount(<TextInputModal isOpen onCancel={ onCancel } />);
            wrapper.find('button[aria-label="Close"]').first().simulate('click');
            expect(onCancel).toHaveBeenCalled();
        });
    });
});
