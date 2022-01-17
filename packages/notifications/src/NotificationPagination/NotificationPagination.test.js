import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import NotificationPagination from './NotificationPagination';

describe('Notification Pagination component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<NotificationPagination page={1} count={10} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('render should contain correct items', () => {
    const wrapper = mount(<NotificationPagination page={1} count={10} />);
    expect(wrapper.find('.pf-c-pagination.pf-m-bottom').length).toBe(1);
    expect(wrapper.find('.pf-c-pagination__nav').length).toBe(1);
  });

  it('should call clear all action', () => {
    const onClearAll = jest.fn();
    const wrapper = mount(<NotificationPagination page={1} count={10} onClearAll={onClearAll} />);
    wrapper.find('.ins-c-pagination__clear-all').last().simulate('click');
    expect(onClearAll).toHaveBeenCalled();
  });

  it('should call next page action', () => {
    const onSetPage = jest.fn();
    const wrapper = mount(<NotificationPagination page={1} count={10} onSetPage={onSetPage} />);
    wrapper.find('.pf-c-pagination__nav button').last().simulate('click');
    expect(onSetPage).toHaveBeenCalled();
  });
});
