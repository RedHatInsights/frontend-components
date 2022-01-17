import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import SkeletonTable from './SkeletonTable';

describe('SkeletonTable component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<SkeletonTable colSize={5} rowSize={15} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly without rows', () => {
    const wrapper = shallow(<SkeletonTable colSize={5} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with static columns', () => {
    const wrapper = shallow(<SkeletonTable columns={['first', 'second']} rowSize={15} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with checkboxes', () => {
    const wrapper = shallow(<SkeletonTable columns={['first', 'second']} rowSize={15} isSelectable={true} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with radio buttons', () => {
    const wrapper = shallow(<SkeletonTable columns={['first', 'second']} rowSize={15} isSelectable={true} hasRadio={true} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
