import React from 'react';
import Radio from './RadioFilter';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

const config = {
  items: [
    {
      label: <div>Custom value</div>,
      value: 'some-value',
      onChange: jest.fn(),
    },
    {
      label: 'Another',
      value: 'another-value',
    },
    {
      label: 'No value',
    },
  ],
};

describe('Radio', () => {
  describe('render', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<Radio />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with items', () => {
      const wrapper = shallow(<Radio {...config} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with items - isDisabled', () => {
      const wrapper = shallow(<Radio {...config} isDisabled />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with items and default value', () => {
      const wrapper = shallow(<Radio {...config} value="some-value" />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with items and selected value', () => {
      const currectConfig = { ...config };
      currectConfig.items[1].isChecked = true;
      const wrapper = shallow(<Radio {...currectConfig} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly placeholder', () => {
      const wrapper = shallow(<Radio {...config} placeholder="some placeholder" />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe('API', () => {
    it('should open', () => {
      const wrapper = mount(<Radio {...config} placeholder="some placeholder" />);
      wrapper.find('button.pf-c-select__toggle').first().simulate('click');
      wrapper.update();
      expect(wrapper.instance().state.isExpanded).toBe(true);
    });

    it('should NOT call onChange', () => {
      const onChange = jest.fn();
      const wrapper = mount(<Radio {...config} placeholder="some placeholder" />);
      wrapper.find('button.pf-c-select__toggle').first().simulate('click');
      wrapper.update();
      wrapper.find('.pf-c-select__menu-item').first().simulate('click');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should call onChange', () => {
      const onChange = jest.fn();
      const wrapper = mount(<Radio {...config} onChange={onChange} placeholder="some placeholder" />);
      wrapper.find('button.pf-c-select__toggle').first().simulate('click');
      wrapper.update();
      wrapper.find('.pf-c-select__menu-item').first().simulate('click');
      expect(onChange).toHaveBeenCalled();
    });

    it('should call onChange on item', () => {
      const wrapper = mount(<Radio {...config} placeholder="some placeholder" />);
      wrapper.find('button.pf-c-select__toggle').first().simulate('click');
      wrapper.update();
      wrapper.find('input.pf-c-radio__input').first().simulate('change');
      expect(config.items[0].onChange).toHaveBeenCalled();
    });

    it('should update selected', () => {
      const onChange = jest.fn();
      const wrapper = mount(<Radio {...config} onChange={onChange} placeholder="some placeholder" />);
      wrapper.find('button.pf-c-select__toggle').first().simulate('click');
      wrapper.update();
      wrapper.find('.pf-c-select__menu-item').first().simulate('click');
      expect(wrapper.instance().state.checked).toBe(config.items[0].value);
    });

    it('should update selected with default value', () => {
      const currectConfig = { ...config };
      currectConfig.items[1].isChecked = true;
      const onChange = jest.fn();
      const wrapper = mount(<Radio {...currectConfig} onChange={onChange} placeholder="some placeholder" />);
      wrapper.find('button.pf-c-select__toggle').first().simulate('click');
      wrapper.update();
      wrapper.find('.pf-c-select__menu-item').first().simulate('click');
      expect(wrapper.instance().state.checked).toBe(config.items[0].value);
    });
  });
});
