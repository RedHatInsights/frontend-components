import React from 'react';
import Checkbox from './CheckboxFilter';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

const config = {
  items: [
    {
      onClick: jest.fn(),
      label: <div>Custom value</div>,
      value: 'some-value',
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

describe('Checkbox', () => {
  describe('render', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<Checkbox />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly - disabled', () => {
      const wrapper = shallow(<Checkbox {...config} isDisabled />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with items', () => {
      const wrapper = shallow(<Checkbox {...config} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with items and default value', () => {
      const wrapper = shallow(<Checkbox {...config} value={['some-value']} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with items and default object value', () => {
      const wrapper = shallow(<Checkbox {...config} value={[{ value: 'some-value' }]} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with items and selected value', () => {
      const currectConfig = { ...config };
      currectConfig.items[1].isChecked = true;
      const wrapper = shallow(<Checkbox {...currectConfig} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly placeholder', () => {
      const wrapper = shallow(<Checkbox {...config} placeholder="some placeholder" />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe('API', () => {
    it('should open', () => {
      const wrapper = mount(<Checkbox {...config} placeholder="some placeholder" />);
      wrapper.find('button.pf-c-select__toggle').first().simulate('click');
      wrapper.update();
      expect(wrapper.instance().state.isExpanded).toBe(true);
    });

    it('should NOT call onChange', () => {
      const onChange = jest.fn();
      const wrapper = mount(<Checkbox {...config} placeholder="some placeholder" />);
      wrapper.find('button.pf-c-select__toggle').first().simulate('click');
      wrapper.update();
      wrapper.find('input.pf-c-check__input').first().simulate('change');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should NOT call onChange', () => {
      const onChange = jest.fn();
      const wrapper = mount(<Checkbox {...config} onChange={onChange} placeholder="some placeholder" />);
      wrapper.find('button.pf-c-select__toggle').first().simulate('click');
      wrapper.update();
      wrapper.find('input.pf-c-check__input').first().simulate('change');
      expect(onChange).toHaveBeenCalled();
    });

    it('should call onClick on item', () => {
      const wrapper = mount(<Checkbox {...config} placeholder="some placeholder" />);
      wrapper.find('button.pf-c-select__toggle').first().simulate('click');
      wrapper.update();
      wrapper.find('input.pf-c-check__input').first().simulate('change');
      expect(config.items[0].onClick).toHaveBeenCalled();
    });

    it('should update selected', () => {
      const wrapper = mount(<Checkbox {...config} placeholder="some placeholder" />);
      wrapper.find('button.pf-c-select__toggle').first().simulate('click');
      wrapper.update();
      wrapper.find('input.pf-c-check__input').first().simulate('change');
      wrapper.update();
      expect(wrapper.instance().state.selected.length).toBe(1);
    });

    it('should update remove selected', () => {
      const wrapper = mount(<Checkbox {...config} value={[{ value: 'some-value' }]} placeholder="some placeholder" />);
      wrapper.find('button.pf-c-select__toggle').first().simulate('click');
      wrapper.update();
      wrapper.find('input.pf-c-check__input').first().simulate('change');
      wrapper.update();
      expect(wrapper.instance().state.selected.length).toBe(0);
    });

    it('should update selected with default value', () => {
      const wrapper = mount(<Checkbox {...config} value={[{ value: 'another-value' }]} placeholder="some placeholder" />);
      wrapper.find('button.pf-c-select__toggle').first().simulate('click');
      wrapper.update();
      wrapper.find('input.pf-c-check__input').first().simulate('change');
      wrapper.update();
      expect(wrapper.instance().state.selected.length).toBe(2);
    });
  });
});
