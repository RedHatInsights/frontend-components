import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import PageHeader from './PageHeader';

describe('PageHeader component', () => {
  it('should render', () => {
    const wrapper = mount(<PageHeader>Something</PageHeader>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
