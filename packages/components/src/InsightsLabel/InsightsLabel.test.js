import { AngleDoubleDownIcon } from '@patternfly/react-icons';
import InsightsLabel from './InsightsLabel';
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('InsightsLabel component', () => {
  it('should render with icon', () => {
    const wrapper = shallow(<InsightsLabel value={1} />).dive();
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find(AngleDoubleDownIcon)).toHaveLength(1);
  });
  it('should render without icon', () => {
    const wrapper = shallow(<InsightsLabel value={1} hideIcon />).dive();
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find(AngleDoubleDownIcon)).toHaveLength(0);
  });
  it('should render defaults', () => {
    const wrapper = shallow(<InsightsLabel />).dive();
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find(AngleDoubleDownIcon)).toHaveLength(1);
  });
});
