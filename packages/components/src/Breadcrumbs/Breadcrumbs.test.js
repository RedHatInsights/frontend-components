import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Breadcrumbs from './Breadcrumbs';

describe('Breadcrumbs component', () => {
  const onNavigate = jest.fn();
  const items = [
    { title: 'First', navigate: 'first' },
    { title: <span>Second</span>, navigate: 'second' },
  ];
  const current = 'Something';
  describe('should render correctly', () => {
    it('no items', () => {
      const wrapper = shallow(<Breadcrumbs items={undefined} current={current} onNavigate={onNavigate} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('no current', () => {
      const wrapper = shallow(<Breadcrumbs items={items} current={undefined} onNavigate={onNavigate} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('with items and current item', () => {
      const wrapper = shallow(<Breadcrumbs items={items} current={current} onNavigate={onNavigate} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe('API', () => {
    it('should call correctly', () => {
      const wrapper = shallow(<Breadcrumbs items={items} current={current} onNavigate={onNavigate} />);
      wrapper.find('a').first().simulate('click');
      expect(onNavigate.mock.calls.length).toBe(1);
      expect(onNavigate.mock.calls[0][1]).toBe(items[0].navigate);
      expect(onNavigate.mock.calls[0][2]).toBe(0);
    });
  });
});
