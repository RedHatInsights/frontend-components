import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import DateFormat from './DateFormat';

describe('DateFormat component', () => {
    it('DateFormat renders', () => {
        const wrapper = shallow(<DateFormat />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
