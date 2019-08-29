import React from 'react';
import Text from './Text';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('Text component', () => {
    describe('render', () => {
        it('should render correctly', () => {
            const wrapper = shallow(<Text />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render placeholder', () => {
            const wrapper = shallow(<Text placeholder="some-placeholder"/>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render value', () => {
            const wrapper = shallow(<Text value="some-value" />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe('API', () => {
        it('should NOT call onSubmit', () => {
            const onSubmit = jest.fn();
            const wrapper = mount(<Text value="some-value" />);
            wrapper.find('input').first().simulate('keydown', { key: 'Enter' });
            expect(onSubmit).not.toHaveBeenCalled();
        });

        it('should call onSubmit', () => {
            const onSubmit = jest.fn();
            const wrapper = mount(<Text value="some-value" onSubmit={ onSubmit }/>);
            wrapper.find('input').first().simulate('keydown', { key: 'Enter' });
            expect(onSubmit).toHaveBeenCalled();
            expect(onSubmit.mock.calls[0][1]).toBe('some-value');
        });

        it('should update state', () => {
            const wrapper = mount(<Text value="some-value" />);
            wrapper.find('input').first().simulate('change', { target: { value: 'new-value' }});
            wrapper.update();
            expect(wrapper.find('Text').instance().state.stateValue).toBe('new-value');
        });

        it('should call on submit with state value', () => {
            const onSubmit = jest.fn();
            const wrapper = mount(<Text onSubmit={ onSubmit }/>);
            wrapper.find('input').first().simulate('change', { target: { value: 'new-value' }});
            wrapper.update();
            wrapper.find('input').first().simulate('keydown', { key: 'Enter' });
            expect(onSubmit).toHaveBeenCalled();
        });

        it('should update state', () => {
            const onChange = jest.fn();
            const wrapper = mount(<Text value="some-value" onChange={ onChange } />);
            wrapper.find('input').first().simulate('change', { target: { value: 'new-value' }});
            expect(onChange).toHaveBeenCalled();
        });
    });
});
