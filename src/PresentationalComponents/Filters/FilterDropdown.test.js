import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import FilterDropdown from './FilterDropdown';

describe('FilterDropdown component', () => {
    it('should render', () => {
        const wrapper = shallow(
            <FilterDropdown
                filters={ {} }
                addFilter={ jest.fn() }
                removeFilter={ jest.fn() }
                filterCategories={ [{ title: '', type: '', urlParam: '', values: [{ label: '', value: '' }]}] }
            />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
