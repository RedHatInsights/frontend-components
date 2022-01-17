import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import TableToolbar from './TableToolbar';

describe('TableToolbar component', () => {
  it('should render', () => {
    const wrapper = shallow(<TableToolbar>Some</TableToolbar>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render with results of 0', () => {
    const wrapper = shallow(<TableToolbar results={0}>Some</TableToolbar>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render with results of 1', () => {
    const wrapper = shallow(<TableToolbar results={1}>Some</TableToolbar>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render with results greater than 1', () => {
    const wrapper = shallow(<TableToolbar results={2}>Some</TableToolbar>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render with selection of 0', () => {
    const wrapper = shallow(<TableToolbar selected={0}>Some</TableToolbar>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render with selection of 1', () => {
    const wrapper = shallow(<TableToolbar selected={1}>Some</TableToolbar>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render with results and selection of 1', () => {
    const wrapper = shallow(
      <TableToolbar results={1} selected={1}>
        Some
      </TableToolbar>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render a footer', () => {
    const wrapper = shallow(<TableToolbar isFooter>Footer</TableToolbar>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
