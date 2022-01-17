import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import EmptyTable from './EmptyTable';

describe('EmptyTable component', () => {
  it('should render', () => {
    const wrapper = shallow(<EmptyTable>Some</EmptyTable>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render with centered children', () => {
    const wrapper = shallow(<EmptyTable centered>Centered</EmptyTable>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
