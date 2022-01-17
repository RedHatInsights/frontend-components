import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import SimpleTableFilter from './SimpleTableFilter';

describe('SimpleTableFilter component', () => {
  describe('should render correctly', () => {
    it('with filter button', () => {
      const wrapper = shallow(<SimpleTableFilter widgetId="filter" />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('with custom filter button', () => {
      const wrapper = shallow(<SimpleTableFilter widgetId="filter" buttonTitle="Custom title" />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('with custom placeholder', () => {
      const wrapper = shallow(<SimpleTableFilter widgetId="filter" placeholder="Custom placeholder" />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('without filter button', () => {
      const wrapper = shallow(<SimpleTableFilter widgetId="filter" buttonTitle={null} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('with filter opitons', () => {
      const wrapper = shallow(
        <SimpleTableFilter
          widgetId="filter"
          options={{
            items: [{ value: 'one', title: 'one' }],
          }}
        />
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('with filter opitons and custom dropdown title', () => {
      const wrapper = shallow(
        <SimpleTableFilter
          widgetId="filter"
          options={{
            title: 'Filter by',
            items: [{ value: 'one', title: 'one' }],
          }}
        />
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe('API', () => {
    const onOptionSelect = jest.fn();
    const onButtonClick = jest.fn();
    const onFilterChange = jest.fn();

    describe('select actions', () => {
      it('selecting should fire event', () => {
        const wrapper = mount(
          <SimpleTableFilter
            widgetId="filter"
            options={{
              title: 'Filter by',
              items: [{ value: 'one', title: 'one' }],
            }}
            onOptionSelect={onOptionSelect}
          />
        );
        wrapper.find('.pf-c-dropdown button.pf-c-dropdown__toggle').first().simulate('click');
        wrapper.update();
        wrapper.find('.pf-c-dropdown ul li button').first().simulate('click');
        expect(onOptionSelect.mock.calls.length).toBe(1);
        expect(onOptionSelect.mock.calls[0][1]).toMatchObject({ value: 'one' });
      });

      it('selecting should not fire event', () => {
        const wrapper = mount(
          <SimpleTableFilter
            widgetId="filter"
            options={{
              title: 'Filter by',
              items: [{ value: 'one', title: 'one' }],
            }}
          />
        );
        wrapper.find('.pf-c-dropdown button.pf-c-dropdown__toggle').first().simulate('click');
        wrapper.update();
        wrapper.find('.pf-c-dropdown ul li button').first().simulate('click');
        expect(onOptionSelect.mock.calls.length).toBe(1);
      });
    });

    describe('input actions', () => {
      it('typing should send events', () => {
        const wrapper = mount(
          <SimpleTableFilter
            widgetId="filter"
            options={{
              title: 'Filter by',
              items: [{ value: 'one', title: 'one' }],
            }}
            onFilterChange={onFilterChange}
          />
        );
        wrapper
          .find('input[widget-id="filter"]')
          .first()
          .simulate('change', { target: { value: '1' } });
        expect(onFilterChange.mock.calls.length).toBe(1);
        expect(onFilterChange.mock.calls[0][0]).toBe('1');
      });

      it('typing should not fire events', () => {
        const wrapper = mount(
          <SimpleTableFilter
            widgetId="filter"
            options={{
              title: 'Filter by',
              items: [{ value: 'one', title: 'one' }],
            }}
          />
        );
        wrapper
          .find('input[widget-id="filter"]')
          .first()
          .simulate('change', { target: { value: '1' } });
        expect(onFilterChange.mock.calls.length).toBe(1);
      });

      it('typing should send selected and input', () => {
        const wrapper = mount(
          <SimpleTableFilter
            widgetId="filter"
            options={{
              title: 'Filter by',
              items: [{ value: 'one', title: 'one' }],
            }}
            onFilterChange={onFilterChange}
          />
        );
        wrapper.find('.pf-c-dropdown button.pf-c-dropdown__toggle').first().simulate('click');
        wrapper.update();
        wrapper.find('.pf-c-dropdown ul li button').first().simulate('click');
        wrapper.update();
        wrapper
          .find('input[widget-id="filter"]')
          .first()
          .simulate('change', { target: { value: '1' } });
        expect(onFilterChange.mock.calls.length).toBe(2);
        expect(onFilterChange.mock.calls[1][1]).toMatchObject({ value: 'one' });
      });

      it('enter should trigger new filter change', () => {
        const wrapper = mount(
          <SimpleTableFilter
            widgetId="filter"
            options={{
              title: 'Filter by',
              items: [{ value: 'one', title: 'one' }],
            }}
            onFilterChange={onFilterChange}
          />
        );
        wrapper.find('.pf-c-dropdown button.pf-c-dropdown__toggle').first().simulate('click');
        wrapper.update();
        wrapper.find('.pf-c-dropdown ul li button').first().simulate('click');
        wrapper.update();
        wrapper
          .find('input[widget-id="filter"]')
          .first()
          .simulate('change', { target: { value: '1' } });
        expect(onFilterChange.mock.calls.length).toBe(3);
        wrapper.find('input[widget-id="filter"]').first().simulate('keypress', { key: 'Enter' });
        expect(onFilterChange.mock.calls.length).toBe(4);
      });
    });

    describe('Button click', () => {
      it('should send input data', () => {
        const wrapper = mount(
          <SimpleTableFilter
            widgetId="filter"
            options={{
              title: 'Filter by',
              items: [{ value: 'one', title: 'one' }],
            }}
            onButtonClick={onButtonClick}
          />
        );
        wrapper
          .find('input[widget-id="filter"]')
          .first()
          .simulate('change', { target: { value: '1' } });
        wrapper.find('button[action="filter"]').first().simulate('click');
        expect(onButtonClick.mock.calls.length).toBe(1);
        expect(onButtonClick.mock.calls[0][0]).toBe('1');
      });

      it('should not send input data', () => {
        const wrapper = mount(
          <SimpleTableFilter
            widgetId="filter"
            options={{
              title: 'Filter by',
              items: [{ value: 'one', title: 'one' }],
            }}
          />
        );
        wrapper
          .find('input[widget-id="filter"]')
          .first()
          .simulate('change', { target: { value: '1' } });
        wrapper.find('button[action="filter"]').first().simulate('click');
        expect(onButtonClick.mock.calls.length).toBe(1);
      });

      it('should send input data and select', () => {
        const wrapper = mount(
          <SimpleTableFilter
            widgetId="filter"
            options={{
              title: 'Filter by',
              items: [{ value: 'one', title: 'one' }],
            }}
            onButtonClick={onButtonClick}
          />
        );
        wrapper.find('.pf-c-dropdown button.pf-c-dropdown__toggle').first().simulate('click');
        wrapper.update();
        wrapper.find('.pf-c-dropdown ul li button').first().simulate('click');
        wrapper.update();
        wrapper
          .find('input[widget-id="filter"]')
          .first()
          .simulate('change', { target: { value: '1' } });
        wrapper.find('button[action="filter"]').first().simulate('click');
        expect(onButtonClick.mock.calls.length).toBe(2);
        expect(onButtonClick.mock.calls[1][1]).toMatchObject({ value: 'one' });
      });
    });
  });
});
