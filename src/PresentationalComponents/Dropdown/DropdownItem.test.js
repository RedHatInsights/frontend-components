import React from 'react';
import DropdownItem from './DropdownItem';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('DropdownItem component', () => {
    console.warn = jest.fn();
    describe('should render correctly', () => {
        it('no props', () => {
            const wrapper = shallow(<DropdownItem />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('separator', () => {
            const wrapper = shallow(<DropdownItem isSeparator className="pf-c-dropdown__menu-item fsf">test</DropdownItem>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('disabled', () => {
            const wrapper = shallow(<DropdownItem isDisabled />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});
