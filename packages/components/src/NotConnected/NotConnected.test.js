import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import NotConnected from './NotConnected';

describe('Not connected component', () => {
    it('should render', () => {
        const wrapper = mount(<NotConnected/>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
