import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import PageHeaderTitle from './PageHeaderTitle';

describe('PageHeader component', () => {
  it('should render', () => {
    const wrapper = mount(<PageHeaderTitle title="Something" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
