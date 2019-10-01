import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import InvalidObject from './InvalidObject';

describe('InvalidObject component', () => {
    it('should render', () => {
        const wrapper = mount(<Router><InvalidObject/></Router>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
