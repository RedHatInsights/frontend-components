import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import DescriptiveCheckbox from './';

describe('Descriptive checkbox tests', () => {

    it('should render correctly', () => {
        const wrapper = mount(
            <DescriptiveCheckbox label="test label" FieldProvider={ ({ render }) => render({ input: {} }) }></DescriptiveCheckbox>
        );
        expect(toJson(wrapper.find('DescriptiveCheckbox'))).toMatchSnapshot();
    });
});
