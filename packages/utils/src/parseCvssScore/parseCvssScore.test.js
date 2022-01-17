import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import parseCvssScore from './parseCvssScore';

describe('parseCvssScore', () => {
  describe('no cvss', () => {
    const result = parseCvssScore();
    const wrapper = mount(result);
    it('should render N/A in span', () => {
      expect(toJson(wrapper.find('span'))).toMatchSnapshot();
    });

    it('should render correct tooltip content', () => {
      expect(toJson(wrapper.find('TooltipContent'))).toMatchSnapshot();
    });
  });

  it('cvssV3', () => {
    const result = parseCvssScore(1, 2);
    const wrapper = mount(<React.Fragment>{result}</React.Fragment>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  describe('cvssV2', () => {
    const result = parseCvssScore(2);
    const wrapper = mount(result);
    it('should render value in span', () => {
      expect(toJson(wrapper.find('span'))).toMatchSnapshot();
    });

    it('should render correct tooltip content', () => {
      expect(toJson(wrapper.find('TooltipContent'))).toMatchSnapshot();
    });
  });

  describe('cvssV2 with labels', () => {
    const result = parseCvssScore(2, 0, true);
    const wrapper = mount(result);
    it('should render value in span', () => {
      expect(toJson(wrapper.find('span'))).toMatchSnapshot();
    });

    it('should render correct tooltip content', () => {
      expect(toJson(wrapper.find('TooltipContent'))).toMatchSnapshot();
    });
  });
});
