import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import DarkContext from './DarkContext';
import ThemeContext from './configContext';

describe('DarkContext', () => {
    it('should render children', () => {
        const wrapper = shallow(
            <DarkContext>
                <div id='isPresent' />
            </DarkContext>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.exists('#isPresent')).toBeTruthy();
    });

    it('should pass props', () => {
        const wrapper = mount(
            <DarkContext>
                <ThemeContext.Consumer>
                    { value => <div value={value} id='consumer'/> }
                </ThemeContext.Consumer>
            </DarkContext>
        );
        expect(wrapper.find('#consumer').props()).toEqual(expect.objectContaining({ value: 'dark' }));
    });
});
