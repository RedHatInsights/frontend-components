import React from 'react';
import ConditionalFilter from './ConditionalFilter';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
      const { container } = render(<ConditionalFilter {...initialProps} />);
      expect(container).toMatchSnapshot();
    });

    it('should render correctly - isDisabled', () => {
      const { container } = render(<ConditionalFilter {...initialProps} items={config} isDisabled />);
      expect(container).toMatchSnapshot();
    });

    it('should render correctly with config', () => {
      const { container } = render(<ConditionalFilter {...initialProps} items={config} />);
      expect(container).toMatchSnapshot();
    });

    it('should render correctly with config - each item as disabled', () => {
      const { container } = render(
        <ConditionalFilter {...initialProps} items={config.map((item) => ({ ...item, filterValues: { ...item.filterValues, isDisabled: true } }))} />
      );
      expect(container).toMatchSnapshot();
    });

    config.map(({ value, label }) => {
      it(`should render correctly ${label} with value ${value}`, () => {
        const onChange = jest.fn();
        const { container } = render(<ConditionalFilter {...initialProps} items={config} value={value} onChange={onChange} />);
        expect(container).toMatchSnapshot();
      });
    });

    it('should render correctly with one filter', () => {
      const { container } = render(<ConditionalFilter {...initialProps} items={[config[0]]} />);
      expect(container).toMatchSnapshot();
    });

    it('should render correctly with with the active label hidden', () => {
      const { container } = render(<ConditionalFilter {...initialProps} hideLabel={true} items={config} />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('API', () => {
    it('should not call onChange', () => {
      const onChange = jest.fn();
      render(<ConditionalFilter {...initialProps} />);
      userEvent.type(screen.getByRole('textbox', { name: 'text input' }), 'new-value');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should call onChange', () => {
      const onChange = jest.fn();
      render(<ConditionalFilter {...initialProps} onChange={onChange} />);
      userEvent.type(screen.getByRole('textbox', { name: 'text input' }), 'new-value');
      expect(onChange).toHaveBeenCalled();
    });

    it('should open dropdown', () => {
      render(<ConditionalFilter {...initialProps} items={config} />);
      userEvent.click(screen.getByRole('button', { name: 'Conditional filter' }));
      expect(screen.getByRole('menu', { name: 'Conditional filter' })).toBeDefined();
    });

    it('should call NOT call onChange when clicked on dropdown', () => {
      const onChange = jest.fn();
      render(<ConditionalFilter {...initialProps} items={config} />);
      userEvent.click(screen.getByRole('button', { name: 'Conditional filter' }));
      userEvent.click(screen.getByRole('menuitem', { name: 'Simple text 1' }));
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should call call onChange when clicked on dropdown', () => {
      const onChange = jest.fn();
      render(<ConditionalFilter {...initialProps} items={config} onChange={onChange} />);
      userEvent.click(screen.getByRole('button', { name: 'Conditional filter' }));
      userEvent.click(screen.getByRole('menuitem', { name: 'Simple text 1' }));
      expect(onChange).toHaveBeenCalled();
    });

    it('should update state on select', () => {
      render(<ConditionalFilter {...initialProps} items={config} />);
      userEvent.click(screen.getByRole('button', { name: 'Conditional filter' }));
      userEvent.click(screen.getByRole('menuitem', { name: 'Checkbox' }));
      expect(screen.getByRole('button', { name: 'Options menu' })).toBeDefined();
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
                value: 'rhel-7',
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

      render(<ConditionalFilter {...initialProps} items={items} />);

      await act(() => {
        userEvent.click(screen.getByRole('button', { name: 'Group filter' }));
      });
      userEvent.click(screen.getByRole('checkbox', { name: 'RHEL 7' }));
      expect(onChange).toHaveBeenCalledWith(
        undefined,
        { 'rhel-7': { 'rhel-7': true } },
        {
          id: undefined,
          items: [
            { label: 'RHEL 7', value: 'rhel-7', id: undefined, type: 'checkbox', className: 'pf-u-pl-xs' },
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
          value: 'rhel-7',
        },
        { label: 'RHEL 7', value: 'rhel-7', id: undefined, type: 'checkbox', className: 'pf-u-pl-xs' },
        'rhel-7',
        'rhel-7'
      );
    });
  });
});
