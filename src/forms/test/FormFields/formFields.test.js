import React from 'react';
import { TextField } from '../../FormFields/formFields';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('Final form fields', () => {
  describe('Text field component', () => {
    let initialProps = {}
    beforeEach(() => {
      initialProps = {
        input: {
          value: '',
          name: 'Foo',
        },
        meta: {},
        label: 'Foo',
      }
    });

    it('should render correctly', () => {
      const wrapper = mount(<TextField {...initialProps} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render error message if the field was not touched', () => {
      const wrapper = mount(<TextField {...initialProps} meta={{...initialProps, error: 'Error'}} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error message', () => {
      const wrapper = mount(<TextField {...initialProps} meta={{...initialProps, error: 'Error', touched: true}} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render required star on the label end', () => {
      const wrapper = mount(<TextField {...initialProps} isRequired />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render helper text', () => {
      const wrapper = mount(<TextField {...initialProps} helperText="Helper text" />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});