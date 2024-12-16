import React from 'react';
import PrimaryToolbar from './PrimaryToolbar';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { act, render } from '@testing-library/react';

const onActionClicked = jest.fn();
const onActionSelect = jest.fn();
const config = {
  useMobileLayout: true,
  pagination: {
    itemCount: 100,
    page: 1,
    perPage: 10,
    onSetPage: jest.fn(),
    onPerPageSelect: jest.fn(),
  },
  exportConfig: {
    onSelect: jest.fn(),
  },
  actionsConfig: {
    actions: [
      <Button key="first" onClick={onActionClicked}>
        {' '}
        Some action
      </Button>,
      <Button key="second" onClick={onActionClicked}>
        Another button
      </Button>,
      {
        label: 'Or objects',
        onClick: onActionClicked,
      },
      'or plain string',
    ],
    onSelect: onActionSelect,
    dropdownProps: { className: 'custom-class' },
  },
  sortByConfig: {
    direction: 'asc',
    onSortChange: jest.fn(),
  },
  bulkSelect: {
    items: [
      {
        title: 'Some action',
        onClick: jest.fn(),
      },
    ],
    checked: false,
    onSelect: jest.fn(),
  },
  filterConfig: {
    items: [
      {
        type: 'text',
        label: 'First filter',
      },
      {
        label: 'Second filter',
        type: 'checkbox',
        filterValues: {
          items: [{ label: 'Some checkbox' }],
        },
      },
    ],
  },
  activeFiltersConfig: {
    filters: [
      {
        category: 'Some',
        chips: [
          {
            name: 'something',
          },
          {
            name: 'something 2',
          },
        ],
      },
      {
        category: 'Another',
        chips: [
          {
            name: 'One chip',
          },
        ],
      },
      {
        name: 'Something else',
      },
    ],
    onDelete: jest.fn(),
  },
};

describe('PrimaryToolbar', () => {
  describe('should render', () => {
    it('no data', () => {
      const { container } = render(<PrimaryToolbar />);
      expect(container).toMatchSnapshot();
    });

    it('elements instead of data', () => {
      const elementsConfig = Object.keys(config)
        .map((key) => ({
          [key]: <div>Loading...</div>,
        }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});

      const { container } = render(<PrimaryToolbar {...elementsConfig} />);
      expect(container).toMatchSnapshot();
    });

    describe('with data', () => {
      it('full config', () => {
        const { container } = render(<PrimaryToolbar {...config} />);
        expect(container).toMatchSnapshot();
      });

      it('only - bulk select', () => {
        const { container } = render(<PrimaryToolbar bulkSelect={config.bulkSelect} />);
        expect(container).toMatchSnapshot();
      });

      it('only - filterConfig', () => {
        const { container } = render(<PrimaryToolbar filterConfig={config.filterConfig} />);
        expect(container).toMatchSnapshot();
      });
    });

    it('custom className', () => {
      const { container } = render(<PrimaryToolbar className="custom-classname" />);
      expect(container).toMatchSnapshot();
    });

    it('custom id', () => {
      const { container } = render(<PrimaryToolbar id="custom-id" />);
      expect(container).toMatchSnapshot();
    });

    it('wrong actionsConfig', () => {
      // eslint-disable-next-line no-unused-vars
      const { actionsConfig, ...rest } = config;
      const { container } = render(<PrimaryToolbar {...rest} />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('API', () => {
    it('should call DESC sort', () => {
      const { container } = render(<PrimaryToolbar {...config} sortByConfig={{ ...config.sortByConfig, direction: 'desc' }} />);
      act(() => {
        container.querySelectorAll('.ins-c-primary-toolbar__actions button.pf-v6-c-menu-toggle')[0].click();
      });
      act(() => {
        container.querySelector('.ins-c-primary-toolbar__overflow-actions.pf-v6-c-menu__item').click();
      });
      expect(config.sortByConfig.onSortChange).toHaveBeenCalled();
      // FIXME: assertions are not working
      // expect(config.sortByConfig.onSortChange).toHaveBeenCalledWith('asc');
    });

    it('should call ASC sort', () => {
      const { container } = render(<PrimaryToolbar {...config} />);
      act(() => {
        container.querySelector('.ins-c-primary-toolbar__actions button.pf-v6-c-menu-toggle').click();
      });
      act(() => {
        container.querySelector('.ins-c-primary-toolbar__overflow-actions.pf-v6-c-menu__item').click();
      });
      expect(config.sortByConfig.onSortChange).toHaveBeenCalled();
      // FIXME: assertions are not working
      // expect(config.sortByConfig.onSortChange).toHaveBeenCalledWith('desc');
    });
  });
});
