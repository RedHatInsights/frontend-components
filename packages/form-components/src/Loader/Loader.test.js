import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Loader from './';

describe('Loader component tests', () => {

    it('should render correctly', () => {
        const wrapper = mount(
            <Loader size="sm"></Loader>
        );
        expect(toJson(wrapper.find('Loader'))).toMatchSnapshot();
    });
});
