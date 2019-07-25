import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import DropdownIndicator from './DropdownIndicator';

describe('DropdownIndicator component', () => {
    describe('should render', () => {
        it('required props', () => {
            const wrapper = shallow(<DropdownIndicator />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});
