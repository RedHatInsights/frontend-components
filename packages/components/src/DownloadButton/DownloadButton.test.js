import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import DownloadButton from './DownloadButton';
import { DropdownItem } from '@patternfly/react-core';

const extraItems = [<DropdownItem key="extra-1" component="button"></DropdownItem>];

describe('DownloadButton component', () => {
  describe('should render', () => {
    it('CSV and JSON by default', () => {
      const wrapper = shallow(<DownloadButton />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('custom items', () => {
      const wrapper = shallow(<DownloadButton extraItems={extraItems} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('disabled', () => {
      const wrapper = shallow(<DownloadButton extraItems={extraItems} isDisabled />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe('API', () => {
    it('clicking should open dropdown', () => {
      const wrapper = mount(<DownloadButton extraItems={extraItems} />);
      wrapper.find('button').first().simulate('click');
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('onSelect should be called with CSV', () => {
      const onSelect = jest.fn();
      const wrapper = mount(<DownloadButton extraItems={extraItems} onSelect={onSelect} />);
      wrapper.find('button').first().simulate('click');
      wrapper.find('ul button').first().simulate('click');
      expect(onSelect.mock.calls.length).toBe(1);
      expect(onSelect.mock.calls[0][1]).toBe('csv');
    });

    it('onSelect should be called with JSON', () => {
      const onSelect = jest.fn();
      const wrapper = mount(<DownloadButton extraItems={extraItems} onSelect={onSelect} />);
      wrapper.find('button').first().simulate('click');
      wrapper.find('ul button').at(1).simulate('click');
      expect(onSelect.mock.calls.length).toBe(1);
      expect(onSelect.mock.calls[0][1]).toBe('json');
    });

    it("shouldn't call onSelect", () => {
      const onSelect = jest.fn();
      const wrapper = mount(<DownloadButton extraItems={extraItems} />);
      wrapper.find('button').first().simulate('click');
      wrapper.find('ul button').at(1).simulate('click');
      expect(onSelect.mock.calls.length).toBe(0);
    });
  });
});
