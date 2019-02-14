import React from 'react';
import Dropdown, { DropdownPosition, DropdownDirection } from './Dropdown';
import DropdownItem from './DropdownItem';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('Dropdown component', () => {
    console.warn = jest.fn();
    describe('should render correctly', () => {
        test('no props', () => {
            const wrapper = shallow(<Dropdown widgetId="test" title="Test" />);
            expect(toJson(wrapper)).toMatchSnapshot();
            expect(console.warn.mock.calls.length).toBe(1);
        });

        test('title as dom', () => {
            const wrapper = shallow(<Dropdown widgetId="test" title={<div>something</div>} />);
            expect(toJson(wrapper)).toMatchSnapshot();
        })

        test('no arrow', () => {
            const wrapper = shallow(<Dropdown widgetId="test" hasArrow={false} title="Test" />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        Object.values(DropdownPosition).forEach((position) => {
            test(`position - ${position}`, () => {
                const wrapper = shallow(<Dropdown widgetId="test" position={position} title="Test" />);
                expect(toJson(wrapper)).toMatchSnapshot();
            });
        });

        Object.values(DropdownDirection).forEach((direction) => {
            test(`direction - ${direction}`, () => {
                const wrapper = shallow(<Dropdown widgetId="test" direction={direction} title="Test" />);
                expect(toJson(wrapper)).toMatchSnapshot();
            });
        });

        test('is opened', () => {
            const wrapper = shallow(<Dropdown widgetId="test" isCollapsed={false} title="Test" />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        test('isKebab', () => {
            const wrapper = shallow(<Dropdown widgetId="test" isKebab title="Test" />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe('API', () => {
        const onToggle = jest.fn();
        const onSelect = jest.fn();

        it('should call on toggle with false', () => {
            const wrapper = mount(<Dropdown widgetId="test" isKebab title="Test" onToggle={onToggle} />);
            wrapper.find('button.pf-c-dropdown__toggle').first().simulate('click');
            expect(onToggle.mock.calls.length).toBe(1);
            expect(onToggle.mock.calls[0][1]).toBe(false);
        });

        it('should call on toggle with true', () => {
            const wrapper = mount(<Dropdown widgetId="test" isKebab title="Test" onToggle={onToggle} isCollapsed={false} />);
            wrapper.find('button.pf-c-dropdown__toggle').first().simulate('click');
            expect(onToggle.mock.calls.length).toBe(2);
            expect(onToggle.mock.calls[1][1]).toBe(true);
        });

        it('should not call on toggle', () => {
            const wrapper = mount(<Dropdown widgetId="test" isKebab title="Test" />);
            wrapper.find('button.pf-c-dropdown__toggle').first().simulate('click');
            expect(onToggle.mock.calls.length).toBe(2);
        });

        it('should call on select', () => {
            const wrapper = mount(
                <Dropdown widgetId="test" isKebab title="Test" onSelect={onSelect} isCollapsed={false}>
                    <DropdownItem>test</DropdownItem>
                </Dropdown>
            );
            wrapper.find('ul.pf-c-dropdown__menu li').first().simulate('click');
            expect(onSelect.mock.calls.length).toBe(1);
        });

        it('should not call on select', () => {
            const wrapper = mount(
                <Dropdown widgetId="test" isKebab title="Test" isCollapsed={false}>
                    <DropdownItem>test</DropdownItem>
                </Dropdown>
            );
            wrapper.find('ul.pf-c-dropdown__menu li').first().simulate('click');
            expect(onSelect.mock.calls.length).toBe(1);
        });
    });
});
