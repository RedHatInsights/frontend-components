import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import MultiValueContainer from './MultiValueContainer';

describe('MultiValueContainer component', () => {
    describe('should render', () => {
        it('single children', () => {
            const wrapper = mount(<MultiValueContainer data={{ label: 'some label' }}>
                <div>some</div>
            </MultiValueContainer>);
            expect(toJson(wrapper)).toMatchSnapshot();
            expect(wrapper.find('div span div').length).toBe(1);
        });

        it('two children', () => {
            const wrapper = mount(<MultiValueContainer data={{ label: 'some label' }}>
                <div>some</div>
                <div>some</div>
            </MultiValueContainer>);
            expect(toJson(wrapper)).toMatchSnapshot();
            expect(wrapper.find('div span div').length).toBe(2);
        });
    });
});
