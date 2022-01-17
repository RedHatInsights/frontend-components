import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import decorator from './decorator';
import { Button } from '@patternfly/react-core';

describe('TreeTable decorator', () => {
  it('should render correctly - no data', () => {
    const toRender = decorator()();
    expect(toRender).toMatchObject({ children: '', className: '' });
  });

  it('should render correctly - with data', () => {
    const { children, className } = decorator()('value', { rowData: { level: 0 } });
    expect(className).toBe('pf-c-treeview__title-cell');
    const wrapper = shallow(children);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly - with data tree collapsed', () => {
    const { children, className } = decorator()('value', { rowData: { level: 0, isTreeOpen: false } });
    expect(className).toBe('pf-c-treeview__title-cell');
    const wrapper = shallow(children);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly - with data tree opened', () => {
    const { children, className } = decorator()('value', { rowData: { level: 0, isTreeOpen: true } });
    expect(className).toBe('pf-c-treeview__title-cell');
    const wrapper = shallow(children);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should not call function on click', () => {
    const callback = jest.fn();
    const { children } = decorator()('value', { rowData: { level: 0, isTreeOpen: true } });
    const wrapper = mount(children);
    wrapper.find(Button).first().simulate('click');
    expect(callback).not.toHaveBeenCalled();
  });

  it('should not call function on click', () => {
    const callback = jest.fn();
    const { children } = decorator(callback)('value', { rowData: { level: 0, isTreeOpen: true } });
    const wrapper = mount(children);
    wrapper.find(Button).first().simulate('click');
    expect(callback).toHaveBeenCalled();
  });
});
