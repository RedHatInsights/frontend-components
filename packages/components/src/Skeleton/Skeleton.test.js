import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Skeleton, { SkeletonSize } from './Skeleton';

describe('Skeleton component', () => {
  Object.values(SkeletonSize).forEach((size) => {
    it(`should render correctly - ${size}`, () => {
      const wrapper = shallow(<Skeleton size={size} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  it('should render correctly without size', () => {
    const wrapper = shallow(<Skeleton />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly as dark', () => {
    const wrapper = shallow(<Skeleton isDark />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
