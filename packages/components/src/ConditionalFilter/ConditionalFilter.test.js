import React from 'react';
import ConditionalFilter from './ConditionalFilter';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { act } from 'react-dom/test-utils';

const config = [
  {
    id: 'some',
    label: 'simple text 1',
    value: 'simple-text-1',
  },
  {
    label: 'simple text 2',
    value: 'simple-text-2',
    type: 'text',
    filterValues: {
      value: 'some-value blaa',
    },
  },
  {
    label: 'checkbox',
    value: 'checkbox-filter',
    type: 'checkbox',
    filterValues: {
      items: [
        {
          label: <div>custom value</div>,
          value: 'some-value',
        },
        {
          label: 'another',
          value: 'another-value',
        },
        {
          label: 'no value',
        },
      ],
    },
  },
  {
    label: 'radio filter',
    value: 'radio-filter',
    type: 'radio',
    filterValues: {
      items: [
        {
          label: <div>custom value</div>,
          value: 'some-value',
        },
        {
          label: 'another',
          value: 'another-value',
        },
      ],
    },
  },
  {
    label: 'no value',
    type: 'text',
  },
];

const initialProps = {
  useMobileLayout: true,
};

describe('ConditionalFilter', () => {
  describe('render', () => {
    it('should render correctly', () => {
      const wrappper = shallow(<ConditionalFilter {...initialProps} />);
      expect(toJson(wrappper)).toMatchSnapshot();
    });

    it('should render correctly - isDisabled', () => {
      const wrappper = shallow(<ConditionalFilter {...initialProps} items={config} isDisabled />);
      expect(toJson(wrappper)).toMatchSnapshot();
    });

    it('should render correctly with config', () => {
      const wrappper = shallow(<ConditionalFilter {...initialProps} items={config} />);
      expect(toJson(wrappper)).toMatchSnapshot();
    });

    it('should render correctly with config - each item as disabled', () => {
      const wrappper = shallow(
        <ConditionalFilter {...initialProps} items={config.map((item) => ({ ...item, filterValues: { ...item.filterValues, isDisabled: true } }))} />
      );
      expect(toJson(wrappper)).toMatchSnapshot();
    });

    config.map(({ value, label }) => {
      it(`should render correctly ${label} with value ${value}`, () => {
        const onChange = jest.fn();
        const wrappper = shallow(<ConditionalFilter {...initialProps} items={config} value={value} onChange={onChange} />);
        expect(toJson(wrappper)).toMatchSnapshot();
      });
    });

    it('should render correctly with one filter', () => {
      const wrappper = shallow(<ConditionalFilter {...initialProps} items={[config[0]]} />);
      expect(toJson(wrappper)).toMatchSnapshot();
    });

    it('should render correctly with with the active label hidden', () => {
      const wrappper = shallow(<ConditionalFilter {...initialProps} hideLabel={true} items={config} />);
      expect(toJson(wrappper)).toMatchSnapshot();
    });
  });

  describe('API', () => {
    it('should not call onChange', () => {
      const onChange = jest.fn();
      const wrappper = mount(<ConditionalFilter {...initialProps} />);
      wrappper
        .find('input')
        .first()
        .simulate('change', { target: { value: 'new-value' } });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should call onChange', () => {
      const onChange = jest.fn();
      const wrappper = mount(<ConditionalFilter {...initialProps} onChange={onChange} />);
      wrappper
        .find('input')
        .first()
        .simulate('change', { target: { value: 'new-value' } });
      expect(onChange).toHaveBeenCalled();
    });

    it('should open dropdown', () => {
      const wrappper = mount(<ConditionalFilter {...initialProps} items={config} />);
      wrappper.find('button.pf-c-dropdown__toggle').first().simulate('click');
      wrappper.update();
      expect(wrappper.instance().state.isOpen).toBe(true);
    });

    it('should call NOT call onChange when clicked on dropdown', () => {
      const onChange = jest.fn();
      const wrappper = mount(<ConditionalFilter {...initialProps} items={config} />);
      wrappper.find('button.pf-c-dropdown__toggle').first().simulate('click');
      wrappper.update();
      wrappper.find('ul.pf-c-dropdown__menu button.pf-c-dropdown__menu-item').first().simulate('click');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should call call onChange when clicked on dropdown', () => {
      const onChange = jest.fn();
      const wrappper = mount(<ConditionalFilter {...initialProps} items={config} onChange={onChange} />);
      wrappper.find('button.pf-c-dropdown__toggle').first().simulate('click');
      wrappper.update();
      wrappper.find('ul.pf-c-dropdown__menu button.pf-c-dropdown__menu-item').first().simulate('click');
      expect(onChange).toHaveBeenCalled();
    });

    it('should update state on select', () => {
      const wrappper = mount(<ConditionalFilter {...initialProps} items={config} />);
      wrappper.find('button.pf-c-dropdown__toggle').first().simulate('click');
      wrappper.update();
      wrappper.find('ul.pf-c-dropdown__menu button.pf-c-dropdown__menu-item').at(2).simulate('click');
      expect(wrappper.instance().state.stateValue).toBe('checkbox-filter');
    });

    it('should select group - RHEL case', async () => {
      const onChange = jest.fn();

      const items = [
        {
          type: 'group',
          label: 'Operating system',
          id: 'operatingsystem',
          filterValues: {
            selected: undefined,
            onChange,
            groups: [
              {
                label: 'RHEL 7',
                value: '7',
                groupSelectable: true,
                items: [
                  {
                    label: 'RHEL 7.1',
                    value: '1',
                    type: 'checkbox',
                  },
                  {
                    label: 'RHEL 7.2',
                    value: '2',
                    type: 'checkbox',
                  },
                  {
                    label: 'RHEL 7.3',
                    value: '3',
                    type: 'checkbox',
                  },
                  {
                    label: 'RHEL 7.4',
                    value: '4',
                    type: 'checkbox',
                  },
                  {
                    label: 'RHEL 7.5',
                    value: '5',
                    type: 'checkbox',
                  },
                  {
                    label: 'RHEL 7.6',
                    value: '6',
                    type: 'checkbox',
                  },
                  {
                    label: 'RHEL 7.7',
                    value: '7',
                    type: 'checkbox',
                  },
                  {
                    label: 'RHEL 7.8',
                    value: '8',
                    type: 'checkbox',
                  },
                  {
                    label: 'RHEL 7.9',
                    value: '9',
                    type: 'checkbox',
                  },
                ],
                type: 'checkbox',
              },
            ],
          },
        },
      ];

      const wrapper = mount(<ConditionalFilter {...initialProps} items={items} />);

      await act(async () => {
        wrapper.find('button.pf-c-menu-toggle').simulate('click');
      });
      wrapper.update();

      await act(async () => {
        wrapper.find('button[role="menuitem"]').at(1).simulate('click');
      });
      wrapper.update();

      expect(onChange).toHaveBeenCalledWith(
        undefined,
        { 7: { 1: true } },
        {
          id: undefined,
          items: [
            { label: 'RHEL 7', value: '7', id: undefined, type: 'checkbox', className: 'pf-u-pl-xs' },
            { label: 'RHEL 7.1', type: 'checkbox', value: '1' },
            { label: 'RHEL 7.2', type: 'checkbox', value: '2' },
            { label: 'RHEL 7.3', type: 'checkbox', value: '3' },
            { label: 'RHEL 7.4', type: 'checkbox', value: '4' },
            { label: 'RHEL 7.5', type: 'checkbox', value: '5' },
            { label: 'RHEL 7.6', type: 'checkbox', value: '6' },
            { label: 'RHEL 7.7', type: 'checkbox', value: '7' },
            { label: 'RHEL 7.8', type: 'checkbox', value: '8' },
            { label: 'RHEL 7.9', type: 'checkbox', value: '9' },
          ],
          label: 'RHEL 7',
          type: 'checkbox',
          value: '7',
        },
        { label: 'RHEL 7.1', type: 'checkbox', value: '1' },
        '7',
        '1'
      );
    });
  });
});
