import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import RowWrapper from './rowWrapper';

describe('TreeTable RowWrapper', () => {
  it('should render correctly - no data', () => {
    const wrapper = shallow(<RowWrapper />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly - with data', () => {
    const wrapper = shallow(
      <RowWrapper
        row={{
          level: 0,
          isTreeOpen: true,
          point: { size: 2 },
          posinset: 1,
        }}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly - with data collapsed', () => {
    const wrapper = shallow(
      <RowWrapper
        row={{
          level: 0,
          isTreeOpen: false,
          point: { size: 2 },
          posinset: 1,
        }}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
