import React from 'react';
import FilterChips from './FilterChips';
import { render } from '@testing-library/react';

const filters = [
  {
    category: 'Group 1',
    chips: [
      {
        name: 'Chip 1',
        isRead: true,
      },
      {
        name: 'Chip 2',
        count: 3,
      },
    ],
  },
  {
    name: 'Chip 3',
  },
  {
    name: 'Chip 4',
  },
];

describe('FilterChips component', () => {
  it('should render - no data', () => {
    const { container } = render(<FilterChips />);
    expect(container).toMatchSnapshot();
  });

  it('should render', () => {
    const { container } = render(<FilterChips filters={filters} />);
    expect(container).toMatchSnapshot();
  });

  it('should render with custom delete message', () => {
    const { container } = render(<FilterChips filters={filters} deleteTitle={<div>Some delete title</div>} />);
    expect(container).toMatchSnapshot();
  });

  it('should render group delete', () => {
    const { container } = render(<FilterChips filters={filters} onDeleteGroup={() => undefined} />);
    expect(container).toMatchSnapshot();
  });

  describe('API', () => {
    it('should call onDelete when deleting a single chip', () => {
      const onDelete = jest.fn();
      const { container } = render(<FilterChips filters={filters} onDelete={onDelete} />);
      const chips = container.querySelectorAll('.pf-v6-c-label button');
      chips[chips.length - 1].click();
      expect(onDelete).toHaveBeenCalledWith(expect.anything(), [{ name: 'Chip 4' }]);
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('should call onDelete when deleting a single chip in group', () => {
      const onDelete = jest.fn();
      const { container } = render(<FilterChips filters={filters} onDelete={onDelete} />);
      container.querySelectorAll('.pf-v6-c-label button')[0].click();
      expect(onDelete).toHaveBeenCalledWith(expect.anything(), [
        {
          category: 'Group 1',
          chips: [
            {
              name: 'Chip 1',
              isRead: true,
            },
          ],
        },
      ]);
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('should call onDelete when deleting all chips', () => {
      const onDelete = jest.fn();
      const { container } = render(<FilterChips filters={filters} onDelete={onDelete} />);
      const buttons = container.querySelectorAll('button');
      buttons[buttons.length - 1].click();
      expect(onDelete).toHaveBeenCalledWith(expect.anything(), filters, true);
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('should not call onDelete when clicking on any ChipGroup', () => {
      const onDelete = jest.fn();
      const { container } = render(<FilterChips filters={filters} onDelete={onDelete} />);

      container.querySelectorAll('.pf-v6-c-label-group').forEach((group) => group.click());
      expect(onDelete).not.toHaveBeenCalled();
    });

    it('should call onDelete when deleting a single chip', () => {
      const onDelete = jest.fn();
      const newGroup = {
        category: 'Group 2',
        chips: [
          {
            name: 'Chip 1',
          },
        ],
      };
      const { container } = render(<FilterChips filters={[...filters, newGroup]} onDeleteGroup={onDelete} />);
      const buttons = container.querySelectorAll('.pf-v6-c-label-group__close button');
      buttons[buttons.length - 1].click();
      expect(onDelete).toHaveBeenCalledWith(
        expect.anything(),
        [newGroup],
        [
          {
            category: 'Group 1',
            chips: [
              {
                name: 'Chip 1',
                isRead: true,
              },
              {
                name: 'Chip 2',
                count: 3,
              },
            ],
          },
        ],
      );
      expect(onDelete).toHaveBeenCalledTimes(1);
    });
  });
});
