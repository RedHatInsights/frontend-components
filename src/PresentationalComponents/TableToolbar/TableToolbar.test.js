import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import TableToolbar from './TableToolbar';

describe('TableToolbar component', () => {
    it('should render', () => {
        const wrapper = shallow(<TableToolbar>Some</TableToolbar>)
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with results of 0', () => {
        const wrapper = shallow(<TableToolbar results={ 0 }>Some</TableToolbar>)
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with results of 1', () => {
        const wrapper = shallow(<TableToolbar results={ 1 }>Some</TableToolbar>)
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with results greater than 1', () => {
        const wrapper = shallow(<TableToolbar results={ 2 }>Some</TableToolbar>)
        expect(toJson(wrapper)).toMatchSnapshot();
    });
})
