import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Input from './Input';
import LabeledInput from './LabeledInput';

describe('Input component', () => {
  describe('should render', () => {
    it('checkbox', () => {
      const wrapper = shallow(<Input widget-id="some-id" type="checkbox" />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('radio', () => {
      const wrapper = shallow(<Input widget-id="some-id" type="radio" />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('text', () => {
      const wrapper = shallow(<Input widget-id="some-id" />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('labeled input', () => {
      const wrapper = shallow(<LabeledInput widget-id="some-id" name="some-name" />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
