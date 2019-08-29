import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import InvalidObject from './InvalidObject';

describe('InvalidObject component', () => {
    it('should render', () => {
        const wrapper = shallow(<InvalidObject/>)
        expect(toJson(wrapper)).toMatchSnapshot();
    });
})
