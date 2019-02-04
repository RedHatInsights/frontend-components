import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import TableToolbar from './TableToolbar';

describe('TableToolbar component', () => {
    it('should render', () => {
        const wrapper = shallow(<TableToolbar>Some</TableToolbar>)
        expect(toJson(wrapper)).toMatchSnapshot();
    });
})
