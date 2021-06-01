import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import TagCount from './TagCount';

describe('TagCount component', () => {
    it('should render a disabled tag count with count 0', () => {
        const wrapper = shallow(<TagCount/>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render a tag count with no value', () => {
        const wrapper = shallow(<TagCount/>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render a tag count of 11', () => {
        const wrapper = shallow(<TagCount count={11}/>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
