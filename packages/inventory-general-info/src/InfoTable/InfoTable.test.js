import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson, { shallowToJson } from 'enzyme-to-json';
import InfoTable from './InfoTable';
import { sortable } from '@patternfly/react-table';
import { Pagination } from '@patternfly/react-core';

describe('InfoTable', () => {
  describe('should render', () => {
    it('no data', () => {
      const wrapper = shallow(<InfoTable />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('one cell', () => {
      const wrapper = shallow(<InfoTable cells={['One cell']} rows={['first', { title: 'second from title' }, ['multiple', 'cells']]} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('multiple cells', () => {
      const wrapper = shallow(
        <InfoTable
          cells={['One cell', 'Second one']}
          rows={[
            ['first', 'second'],
            [{ title: 'second from title' }, 'another'],
            ['multiple', 'cells'],
          ]}
        />
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expandable set to true', () => {
      const wrapper = shallow(
        <InfoTable
          expandable
          cells={['One cell', 'Second one']}
          rows={[
            ['first', 'second'],
            [{ title: 'second from title' }, 'another'],
            ['multiple', 'cells'],
          ]}
        />
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('onSort set', () => {
      const wrapper = shallow(
        <InfoTable
          onSort={jest.fn()}
          cells={[{ title: 'One cell', transforms: [sortable] }, 'Second one']}
          rows={[
            ['first', 'second'],
            [{ title: 'second from title' }, 'another'],
            ['multiple', 'cells'],
          ]}
        />
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe('api', () => {
    it('expandable should open', () => {
      const wrapper = mount(
        <InfoTable
          expandable
          cells={['One cell', 'Second one']}
          rows={[
            {
              cells: ['first', 'second'],
            },
            {
              cells: [{ title: 'second from title' }],
            },
            {
              cells: ['multiple', 'cells'],
            },
            {
              cells: ['child'],
            },
          ]}
        />
      );
      wrapper.find('.pf-c-table__toggle button').first().simulate('click');
      wrapper.update();
      expect(shallowToJson(wrapper)).toMatchSnapshot();
    });

    it('onSort with expandable', () => {
      const onSort = jest.fn();
      const wrapper = mount(
        <InfoTable
          expandable
          onSort={onSort}
          cells={[{ title: 'One cell', transforms: [sortable] }, 'Second one']}
          rows={[
            {
              cells: ['first', 'second'],
            },
            {
              cells: [{ title: 'second from title' }],
            },
            {
              cells: ['multiple', 'cells'],
            },
            {
              cells: ['child'],
            },
          ]}
        />
      );
      wrapper.find('th.pf-c-table__sort button').first().simulate('click');
      expect(onSort.mock.calls[0][1]).toBe(0);
      expect(onSort.mock.calls[0][2]).toBe('desc');
    });

    it('onSort should be called', () => {
      const onSort = jest.fn();
      const wrapper = mount(
        <InfoTable
          onSort={onSort}
          cells={[{ title: 'One cell', transforms: [sortable] }, 'Second one']}
          rows={[
            ['first', 'second'],
            [{ title: 'second from title' }, 'another'],
            ['multiple', 'cells'],
          ]}
        />
      );
      wrapper.find('th.pf-c-table__sort button').first().simulate('click');
      expect(onSort).toHaveBeenCalled();
      expect(onSort.mock.calls[0][1]).toBe(0);
      expect(onSort.mock.calls[0][2]).toBe('desc');
    });

    it('onSort should be called', () => {
      const onSort = jest.fn();
      const wrapper = mount(
        <InfoTable
          cells={[{ title: 'One cell', transforms: [sortable] }, 'Second one']}
          rows={[
            ['first', 'second'],
            [{ title: 'second from title' }, 'another'],
            ['multiple', 'cells'],
          ]}
        />
      );
      wrapper.find('th.pf-c-table__sort button').first().simulate('click');
      expect(onSort).not.toHaveBeenCalled();
    });

    it('should limit number of rows', () => {
      const wrapper = mount(<InfoTable cells={[{ title: 'One cell' }, 'Second one']} rows={[...new Array(50)].map(() => [...new Array(2)])} />);
      expect(wrapper.find('table tbody tr').length).toBe(10);
    });

    it('should paginate to next page', () => {
      const wrapper = mount(
        <InfoTable
          cells={[{ title: 'One cell' }, 'Second one']}
          rows={[...new Array(50)].map((_e, index) => [...new Array(2)].map((_e, cell) => `${index}-${cell}`))}
        />
      );
      expect(toJson(wrapper.find('table tbody tr').first())).toMatchSnapshot();
      wrapper.find('nav.pf-c-pagination__nav [data-action="next"]').first().simulate('click');
      expect(wrapper.find('table tbody tr').length).toBe(10);
      expect(toJson(wrapper.find('table tbody tr').first())).toMatchSnapshot();
    });

    it('should paginate to 1 when filtering', () => {
      const wrapper = mount(
        <InfoTable
          cells={[{ title: 'One cell' }, 'Second one']}
          rows={[...new Array(50)].map((_e, index) => [...new Array(2)].map((_e, cell) => `${index}-${cell}`))}
          filters={[{ index: 0 }, { index: 1 }]}
        />
      );

      wrapper.find('nav.pf-c-pagination__nav [data-action="next"]').first().simulate('click');

      expect(wrapper.find(Pagination).first().props().page).toEqual(2);

      wrapper
        .find('input.ins-c-conditional-filter')
        .first()
        .simulate('change', { target: { value: '10-0' } });

      expect(wrapper.find(Pagination).first().props().page).toEqual(1);
    });

    it('should paginate to 1 when removing filters', () => {
      const wrapper = mount(
        <InfoTable
          cells={[{ title: 'One cell' }, 'Second one']}
          rows={[...new Array(50)].map(() => [...new Array(2)].map((_e, cell) => `item-${cell}`))}
          filters={[{ index: 0 }, { index: 1 }]}
        />
      );

      wrapper
        .find('input.ins-c-conditional-filter')
        .first()
        .simulate('change', { target: { value: 'item' } });
      wrapper.find('nav.pf-c-pagination__nav [data-action="next"]').first().simulate('click');

      expect(wrapper.find(Pagination).first().props().page).toEqual(2);

      wrapper.find('.ins-c-chip-filters ul.pf-c-chip-group__list .pf-c-chip-group__list-item button').first().simulate('click');

      expect(wrapper.find(Pagination).first().props().page).toEqual(1);
    });

    it('should change per page count', () => {
      const wrapper = mount(
        <InfoTable
          cells={[{ title: 'One cell' }, 'Second one']}
          rows={[...new Array(50)].map((_e, index) => [...new Array(2)].map((_e, cell) => `${index}-${cell}`))}
        />
      );
      wrapper.find('.pf-c-pagination .pf-c-options-menu button.pf-c-options-menu__toggle-button').first().simulate('click');
      wrapper.update();
      wrapper.find('ul.pf-c-options-menu__menu button[data-action="per-page-20"]').first().simulate('click');
      expect(wrapper.find('table tbody tr').length).toBe(20);
    });

    it('should paginate to last page', () => {
      const wrapper = mount(
        <InfoTable
          cells={[{ title: 'One cell' }, 'Second one']}
          rows={[...new Array(50)].map((_e, index) => [...new Array(2)].map((_e, cell) => `${index}-${cell}`))}
        />
      );
      expect(toJson(wrapper.find('table tbody tr').first())).toMatchSnapshot();
      wrapper.find('nav.pf-c-pagination__nav [data-action="last"]').first().simulate('click');
      expect(wrapper.find('table tbody tr').length).toBe(10);
      expect(toJson(wrapper.find('table tbody tr').first())).toMatchSnapshot();
    });

    it('should change per page count - bottom pagination', () => {
      const wrapper = mount(
        <InfoTable
          cells={[{ title: 'One cell' }, 'Second one']}
          rows={[...new Array(50)].map((_e, index) => [...new Array(2)].map((_e, cell) => `${index}-${cell}`))}
        />
      );
      wrapper.find('.ins-c-table__toolbar .pf-c-pagination .pf-c-options-menu button.pf-c-options-menu__toggle-button').first().simulate('click');
      wrapper.update();
      wrapper.find('.ins-c-table__toolbar ul.pf-c-options-menu__menu button[data-action="per-page-20"]').first().simulate('click');
      expect(wrapper.find('table tbody tr').length).toBe(20);
    });

    it('should filter away all items', () => {
      const wrapper = mount(
        <InfoTable
          cells={[{ title: 'One cell' }, 'Second one']}
          rows={[...new Array(50)].map(() => [...new Array(2)])}
          filters={[{ index: 0 }, { index: 1 }]}
        />
      );
      wrapper.find('input.ins-c-conditional-filter').simulate('change', { target: { value: 'something' } });
      expect(wrapper.find('table tbody tr').length).toBe(0);
    });

    it('should filter away items but left one', () => {
      const wrapper = mount(
        <InfoTable
          cells={[{ title: 'One cell' }, 'Second one']}
          rows={[...new Array(50)].map((_e, index) => [...new Array(2)].map((_e, cell) => `${index}-${cell}`))}
          filters={[{ index: 0 }, { index: 1 }]}
        />
      );
      wrapper
        .find('input.ins-c-conditional-filter')
        .first()
        .simulate('change', { target: { value: '10-0' } });
      wrapper.update();
      expect(wrapper.find('table tbody tr').length).toBe(1);
    });

    it('should remove filter chip', () => {
      const wrapper = mount(
        <InfoTable
          cells={[{ title: 'One cell' }, 'Second one']}
          rows={[...new Array(50)].map(() => [...new Array(2)])}
          filters={[{ index: 0 }, { index: 1 }]}
        />
      );
      wrapper.find('input.ins-c-conditional-filter').simulate('change', { target: { value: 'something' } });
      expect(wrapper.find('table tbody tr').length).toBe(0);
      wrapper.find('.ins-c-chip-filters ul.pf-c-chip-group__list .pf-c-chip-group__list-item button').first().simulate('click');
      expect(wrapper.find('table tbody tr').length).toBe(10);
    });

    it('should add checkbox filter', () => {
      const wrapper = mount(
        <InfoTable
          cells={[{ title: 'One cell' }, 'Second one']}
          rows={[...new Array(50)].map((_e, index) => [...new Array(2)].map((_e, cell) => `${index}-${cell}`))}
          filters={[{ type: 'checkbox', options: [{ label: 'ff' }] }]}
        />
      );
      wrapper.find('.ins-c-conditional-filter .pf-c-select .pf-c-select__toggle').simulate('click');
      wrapper.update();
      wrapper
        .find('.ins-c-conditional-filter .pf-c-select__menu .pf-c-select__menu-item .pf-c-check__input')
        .first()
        .simulate('change', { target: { value: true } });
      wrapper.update();
      expect(wrapper.find('table tbody tr').length).toBe(0);
    });
  });
});
