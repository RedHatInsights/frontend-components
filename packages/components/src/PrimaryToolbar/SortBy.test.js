import React from 'react';
import SortBy from './SortBy';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('PrimaryToolbar', () => {
  describe('should render', () => {
    it('no data', () => {
      const wrapper = shallow(<SortBy />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('desc direction', () => {
      const wrapper = shallow(<SortBy direction="desc" />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe('API', () => {
    it('should NOT call changeDirection', () => {
      const onSortChange = jest.fn();
      const wrapper = mount(<SortBy />);
      wrapper.find('button').simulate('click');
      expect(onSortChange).not.toHaveBeenCalled();
    });

    it('should call changeDirection - desc', () => {
      const onSortChange = jest.fn();
      const wrapper = mount(<SortBy onSortChange={onSortChange} />);
      wrapper.find('button').simulate('click');
      expect(onSortChange).toHaveBeenCalled();
      expect(onSortChange.mock.calls[0][1]).toBe('desc');
    });

    it('should call changeDirection - desc', () => {
      const onSortChange = jest.fn();
      const wrapper = mount(<SortBy onSortChange={onSortChange} direction="desc" />);
      wrapper.find('button').simulate('click');
      expect(onSortChange).toHaveBeenCalled();
      expect(onSortChange.mock.calls[0][1]).toBe('asc');
    });
  });
});
