import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Input from './Input';

describe('Input component', () => {
    describe('should render', () => {
        [true, false].map(item => {
            it(`isMulti - ${item}`, () => {
            const wrapper = shallow(<Input selectProps={{ isMulti: item }} />);
            expect(toJson(wrapper)).toMatchSnapshot();
        })});
    });
});
