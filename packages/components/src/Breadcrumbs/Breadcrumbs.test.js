import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
      const { container } = render(<Breadcrumbs items={undefined} current={current} onNavigate={onNavigate} />);
      expect(container).toMatchSnapshot();
    });

    it('no current', () => {
      const { container } = render(<Breadcrumbs items={items} current={undefined} onNavigate={onNavigate} />);
      expect(container).toMatchSnapshot();
    });

    it('with items and current item', () => {
      const { container } = render(<Breadcrumbs items={items} current={current} onNavigate={onNavigate} />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('API', () => {
    it('should call correctly', () => {
      const { container } = render(<Breadcrumbs items={items} current={current} onNavigate={onNavigate} />);
      userEvent.click(container.querySelector('a'));
      expect(onNavigate.mock.calls.length).toBe(1);
      expect(onNavigate.mock.calls[0][1]).toBe(items[0].navigate);
      expect(onNavigate.mock.calls[0][2]).toBe(0);
    });
  });
});
