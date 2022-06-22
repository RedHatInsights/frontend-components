import React from 'react';
import PrimaryToolbar from './PrimaryToolbar';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Button } from '@patternfly/react-core';

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
      const wrapper = shallow(<PrimaryToolbar />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('elements instead of data', () => {
      const elementsConfig = Object.keys(config)
        .map((key) => ({
          [key]: <div>Loading...</div>,
        }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});

      const wrapper = shallow(<PrimaryToolbar {...elementsConfig} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('with data', () => {
      it('full config', () => {
        const wrapper = shallow(<PrimaryToolbar {...config} />);
        expect(toJson(wrapper)).toMatchSnapshot();
      });

      it('only - bulk select', () => {
        const wrapper = shallow(<PrimaryToolbar bulkSelect={config.bulkSelect} />);
        expect(toJson(wrapper)).toMatchSnapshot();
      });

      it('only - filterConfig', () => {
        const wrapper = shallow(<PrimaryToolbar filterConfig={config.filterConfig} />);
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    it('custom className', () => {
      const wrapper = shallow(<PrimaryToolbar className="custom-classname" />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('custom id', () => {
      const wrapper = shallow(<PrimaryToolbar id="custom-id" />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('wrong actionsConfig', () => {
      // eslint-disable-next-line no-unused-vars
      const { actionsConfig, ...rest } = config;
      const wrapper = shallow(<PrimaryToolbar {...rest} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe('API', () => {
    it('should call DESC sort', () => {
      const wrapper = mount(<PrimaryToolbar {...config} sortByConfig={{ ...config.sortByConfig, direction: 'desc' }} />);
      wrapper.find('.ins-c-primary-toolbar__actions button.pf-c-dropdown__toggle').first().simulate('click');
      wrapper.update();
      wrapper.find('.ins-c-primary-toolbar__overflow-actions.pf-c-dropdown__menu-item').first().simulate('click');
      expect(config.sortByConfig.onSortChange).toHaveBeenCalled();
      expect(config.sortByConfig.onSortChange.mock.calls[0][1]).toBe('asc');
    });

    it('should call ASC sort', () => {
      const wrapper = mount(<PrimaryToolbar {...config} />);
      wrapper.find('.ins-c-primary-toolbar__actions button.pf-c-dropdown__toggle').first().simulate('click');
      wrapper.update();
      wrapper.find('.ins-c-primary-toolbar__overflow-actions.pf-c-dropdown__menu-item').at(1).simulate('click');
      expect(config.sortByConfig.onSortChange).toHaveBeenCalled();
      expect(config.sortByConfig.onSortChange.mock.calls[1][1]).toBe('desc');
    });
  });
});
