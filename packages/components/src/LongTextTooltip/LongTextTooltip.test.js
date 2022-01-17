import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import LongTextTooltip from './LongTextTooltip';

describe('LongTextTooltip component', () => {
  it('should render', () => {
    const wrapper = mount(<LongTextTooltip />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render content', () => {
    const wrapper = mount(<LongTextTooltip content="Lorem Impsum" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render content with maxLength', () => {
    const wrapper = mount(<LongTextTooltip content="Lorem Impsum" maxLength={50} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render content with maxLength shorter than content', () => {
    const wrapper = mount(<LongTextTooltip content="Lorem Impsum" maxLength={1} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render tooltip in a different spot', () => {
    const wrapper = mount(<LongTextTooltip content="Lorem Impsum" tooltipPosition="bottom" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render tooltip in a different spot', () => {
    const wrapper = mount(<LongTextTooltip content="Lorem Impsum" tooltipPosition="left" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render tooltip in a different spot', () => {
    const wrapper = mount(<LongTextTooltip content="Lorem Impsum" tooltipPosition="right" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render content tooltip in a different spot with different width', () => {
    const wrapper = mount(<LongTextTooltip content="Lorem Impsum" tooltipPosition="left" tooltipMaxWidth="10vw" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
