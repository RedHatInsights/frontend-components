import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import TabLayout from './TabLayout';

const items = [
  {
    name: 'one',
    title: <div>one</div>,
  },
  {
    name: 'two',
    title: 'two',
  },
];

describe('TabLayout component', () => {
  describe('should render', () => {
    it('without items', () => {
      const wrapper = shallow(<TabLayout />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('with items', () => {
      const wrapper = shallow(<TabLayout items={items} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('with active item', () => {
      const wrapper = shallow(<TabLayout items={items} active="one" />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe('API', () => {
    const onTabClick = jest.fn();

    it('should call onTabClick', () => {
      const wrapper = mount(<TabLayout onTabClick={onTabClick} items={items} />);
      wrapper.find('.ins-tabs > div').first().simulate('click');
      expect(onTabClick.mock.calls.length).toBe(1);
      expect(onTabClick.mock.calls[0][1]).toMatchObject(items[0]);
    });

    it("it shouldn't call onTabClick", () => {
      const wrapper = mount(<TabLayout items={items} />);
      wrapper.find('.ins-tabs > div').first().simulate('click');
      expect(onTabClick.mock.calls.length).toBe(1);
    });
  });
});
