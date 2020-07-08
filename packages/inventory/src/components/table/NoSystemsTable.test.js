import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import NoSystemsTable from './NoSystemsTable';

describe('NoSystemsTable', () => {
    it('should render correctly - no data', () => {
        const wrapper = mount(<NoSystemsTable />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
