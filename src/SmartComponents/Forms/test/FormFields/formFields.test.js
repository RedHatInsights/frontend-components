import React from 'react';
import { TextField, InputGroup } from '../../FormFields/formFields';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('Final form fields', () => {
  describe('Input group component', () => {
    it('should render input group without title and description', () => {
      const wrapper = mount(<InputGroup><h1>Children of input group</h1></InputGroup>)
      expect(toJson(wrapper)).toMatchSnapshot()
    });

    it('should render input group with title', () => {
      const wrapper = mount(<InputGroup title="Input group title"><h1>Children of input group</h1></InputGroup>)
      expect(toJson(wrapper)).toMatchSnapshot()
    });

    it('should render input group with description', () => {
      const wrapper = mount(<InputGroup description="Input group description"><h1>Children of input group</h1></InputGroup>)
      expect(toJson(wrapper)).toMatchSnapshot()
    });

    it('should render input group with title and description', () => {
      const wrapper = mount(<InputGroup title="Input group title" description="Input group description"><h1>Children of input group</h1></InputGroup>)
      expect(toJson(wrapper)).toMatchSnapshot()
    });
  });

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