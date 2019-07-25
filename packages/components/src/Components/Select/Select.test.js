import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Select from './Select';

describe('Select component', () => {
    describe('should render', () => {
        it('default props', () => {
            const wrapper = shallow(<Select />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('isMuli', () => {
            const wrapper = shallow(<Select isMulti />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('simpleValue - false', () => {
            const wrapper = shallow(<Select simpleValue={false} value={{ label: 'some', value: 'value' }}/>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('creatable', () => {
            const wrapper = shallow(<Select value="some" options={[{ label: 'some', value: 'value' }]}/>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('creatable and multi', () => {
            const wrapper = shallow(<Select value={[ 'some' ]} options={[{ label: 'some', value: 'value' }]} />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe('api', () => {
        const onChange = jest.fn();

        it('should NOT call onChange', () => {
            const wrapper = mount(<Select value={[]} menuIsOpen options={[{ label: 'some', value: 'value' }]} />);
            wrapper.find('.ins-c-select__option').first().simulate('click');
            expect(onChange.mock.calls.length).toBe(0);
        });

        it('should call onChange', () => {
            const wrapper = mount(<Select
                value={[]}
                onChange={onChange}
                menuIsOpen
                options={[{ label: 'some', value: 'value' }]}
            />);
            wrapper.find('.ins-c-select__option').first().simulate('click');
            expect(onChange.mock.calls.length).toBe(1);
            expect(onChange.mock.calls[0]).toEqual(['value']);
        });

        it('should call onChange with object', () => {
            const wrapper = mount(<Select
                value={[]}
                simpleValue={false}
                onChange={onChange}
                menuIsOpen
                options={[{ label: 'some', value: 'value' }]}
            />);
            wrapper.find('.ins-c-select__option').first().simulate('click');
            expect(onChange.mock.calls.length).toBe(2);
            expect(onChange.mock.calls[1]).toEqual([{value: 'value', label: 'some'}]);
        });
    })
});
