import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { lauraSchema2, lauraUiSchema, simple, uiSchemaSimple } from '../../demoData/formSchemas';
import FormRenderer from '../../DataDrivenForm/formRenderer';

describe('Form renderer', () => {
  it('should render simple form with input and switch', () => {
    const submit = jest.fn();
    const wrapper = mount(<FormRenderer schema={simple} uiSchema={uiSchemaSimple} onSubmit={submit} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should not call submit function if form state is invalid', () => {
    const submit = jest.fn();
    const wrapper = mount(<FormRenderer schema={lauraSchema2} uiSchema={lauraUiSchema} onSubmit={submit} />);
    const submitButton = wrapper.find('button#form-renderer-submit');
    submitButton.simulate('click');
    expect(submit).not.toHaveBeenCalled();
  });

  it('should call submit function if form state valid', () => {
    const submit = jest.fn();
    const wrapper = mount(<FormRenderer schema={lauraSchema2} uiSchema={lauraUiSchema} onSubmit={submit} />);
    const submitButton = wrapper.find('button#form-renderer-submit');
    submitButton.simulate('click');
    expect(submit).not.toHaveBeenCalled();
    const nameInput = wrapper.find('input#name')
    nameInput.instance().value = 'Name';
    nameInput.simulate('change')

    const urlInput = wrapper.find('input#url');
    urlInput.instance().value = 'some.url';
    urlInput.simulate('change');

    submitButton.simulate('click');
    expect(submit).toHaveBeenCalledWith({ name: 'Name', url: 'some.url' }, expect.any(Object));
  });
});