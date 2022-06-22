import React from 'react';
import Group from './GroupFilter';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const config = {
  onChange: jest.fn(),
  groups: [
    {
      label: 'First value',
      items: [
        {
          label: 'First value',
          value: 'first',
        },
        {
          label: 'Second value',
        },
      ],
    },
    {
      label: 'Second value',
      value: 'second',
      type: 'checkbox',
      items: [
        {
          label: 'First checkbox',
        },
        {
          label: 'Second checkbox',
          value: 'some-value',
        },
      ],
    },
    {
      label: 'Third value',
      value: 'third',
      type: 'radio',
      items: [
        {
          label: 'First radio',
        },
        {
          label: 'Second radio',
        },
      ],
    },
    {
      label: 'Groupselectable value',
      groupSelectable: true,
      items: [
        {
          label: 'First value',
          value: 'first',
        },
        {
          label: 'Second value',
        },
      ],
    },
    {
      label: 'TreeView',
      type: 'treeView',
      items: [
        {
          label: 'First level',
          value: 'firstLevel',
          hasCheck: false,
          type: 'treeView',
          children: [
            {
              label: 'Second level',
              value: 'secondLevel',
              children: [
                {
                  label: 'Item 1',
                  value: 'item1',
                },
                {
                  label: 'Item 2',
                  value: 'item2',
                },
              ],
            },
          ],
          defaultExpanded: true,
        },
      ],
    },
  ],
  items: [
    {
      label: 'First level',
      value: 'firstLevel2',
      hasCheck: false,
      type: 'treeView',
      children: [
        {
          label: 'Second level',
          value: 'secondLevel2',
          children: [
            {
              label: 'Item 1',
              value: 'item12',
            },
            {
              label: 'Item 2',
              value: 'item22',
            },
          ],
        },
      ],
      defaultExpanded: true,
    },
  ],
};

describe('Group - component', () => {
  describe('render', () => {
    it('should render correctly', () => {
      const { container } = render(<Group onChange={jest.fn()} />);
      expect(container).toMatchSnapshot();
    });

    it('should render correctly with items', () => {
      const { container } = render(<Group {...config} />);
      expect(container).toMatchSnapshot();
    });

    describe('show more', () => {
      it('should render correctly with items and default text', () => {
        const { container } = render(<Group {...config} onShowMore={() => undefined} />);
        expect(container).toMatchSnapshot();
      });

      it('should render correctly with items and custom text', () => {
        const { container } = render(<Group {...config} onShowMore={() => undefined} showMoreTitle="some title" />);
        expect(container).toMatchSnapshot();
      });

      it('should render correctly with items and different variant', () => {
        const { container } = render(
          <Group
            {...config}
            onShowMore={() => undefined}
            showMoreOptions={{
              variant: 'default',
            }}
          />
        );
        expect(container).toMatchSnapshot();
      });

      it('should render correctly with items and custom props', () => {
        const { container } = render(
          <Group
            {...config}
            onShowMore={() => undefined}
            showMoreOptions={{
              props: {
                className: 'some-test-class',
              },
            }}
          />
        );
        expect(container).toMatchSnapshot();
      });
    });

    it('should render correctly with items - isDisabled', () => {
      const { container } = render(<Group {...config} isDisabled />);
      expect(container).toMatchSnapshot();
    });

    it('should render correctly with items and default value', () => {
      const { container } = render(<Group {...config} value={[{ value: 'some-value' }]} />);
      expect(container).toMatchSnapshot();
    });

    it('should render correctly placeholder', () => {
      const { container } = render(<Group {...config} placeholder="some placeholder" />);
      expect(container).toMatchSnapshot();
    });

    it('should render correctly with selectable group', () => {
      const {
        groups: [first, ...groups],
      } = config;
      const [firstItem, ...items] = first.items;
      const { container } = render(
        <Group
          {...config}
          groups={[
            {
              ...first,
              items: [
                {
                  ...firstItem,
                  isChecked: true,
                },
                ...items,
              ],
            },
            ...groups,
          ]}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it('should render correctly with items and selected value', () => {
      const currectConfig = { ...config };
      currectConfig.groups[1].items[1].isChecked = true;
      const { container } = render(<Group {...currectConfig} />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('API', () => {
    it('should open', async () => {
      render(<Group {...config} />);
      act(() => {
        userEvent.click(screen.getByRole('button', { name: 'Group filter' }));
      });
      expect(screen.getByRole('menubar', { name: 'Group filter' })).toBeDefined();
    });
  });
});
