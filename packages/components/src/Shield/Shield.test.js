import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import Shield from './Shield';

describe('Shield component', () => {
  it('should render without props', () => {
    const wrapper = shallow(<Shield />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render where impact value is undefined', () => {
    const wrapper = shallow(<Shield impact={undefined} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render where impact value is empty string', () => {
    const wrapper = shallow(<Shield impact={''} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render where impact value is Low', () => {
    const wrapper = shallow(<Shield impact={'Low'} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render where impact value is Critical', () => {
    const wrapper = shallow(<Shield impact={'Critical'} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render where impact value is 4', () => {
    const wrapper = shallow(<Shield impact={4} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render where impact value is 3', () => {
    const wrapper = shallow(<Shield impact={3} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render where impact value is 2', () => {
    const wrapper = shallow(<Shield impact={2} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render where impact value is 1', () => {
    const wrapper = shallow(<Shield impact={1} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render where impact value is NonExist', () => {
    const wrapper = shallow(<Shield impact={'NonExist'} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render with label', () => {
    const wrapper = shallow(<Shield impact={'Medium'} hasLabel />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render where hasTooltip is false', () => {
    const wrapper = shallow(<Shield hasTooltip={false} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
