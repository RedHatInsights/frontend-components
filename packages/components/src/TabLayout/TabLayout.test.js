import React from 'react';
import TabLayout from './TabLayout';
import { render } from '@testing-library/react';

const items = [
  {
    name: 'one',
    title: <div>one</div>,
  },
  {
    name: 'two',
    title: 'two',
  },
];

describe('TabLayout component', () => {
  describe('should render', () => {
    it('without items', () => {
      const { container } = render(<TabLayout />);
      expect(container).toMatchSnapshot();
    });

    it('with items', () => {
      const { container } = render(<TabLayout items={items} />);
      expect(container).toMatchSnapshot();
    });

    it('with active item', () => {
      const { container } = render(<TabLayout items={items} active="one" />);
      expect(container).toMatchSnapshot();
    });
  });
});
