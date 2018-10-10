import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { lauraSchema2, lauraUiSchema, nestedSchema, nestedUiSchema, widgets, uiWidgets } from '../../demoData/formSchemas';
import FormRenderer from '../../DataDrivenForm/formRenderer';

describe('Form renderer', () => {
  it('should render all form widgets', () => {
    /**
     * Throws console error because of select component
     * Will be removed once there is a PF-4 select component
     */
    const submit = jest.fn();
    const wrapper = mount(<FormRenderer schema={widgets} uiSchema={uiWidgets} onSubmit={submit} />);
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

  it('should render form with array property', () => {
    const wrapper = mount(<FormRenderer
        schema={nestedSchema}
        uiSchema={nestedUiSchema}
        onSubmit={jest.fn()}
        initialValues={{"tasks":[{"title":"task title","details":"task description"}],"title":"title"}}
      />);
    const addButton = wrapper.find('button#add-tasks');
    addButton.simulate('click');
    wrapper.update();
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});