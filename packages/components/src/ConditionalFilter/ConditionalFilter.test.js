import React from 'react';
import ConditionalFilter from './ConditionalFilter';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const config = [
  {
    id: 'some',
    label: 'simple text 1',
    value: 'simple-text-1',
    type: 'text',
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
    value: '',
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
      act(() => {
        userEvent.type(screen.getByRole('textbox', { name: 'text input' }), 'new-value');
      });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should call onChange', () => {
      const onChange = jest.fn();
      render(<ConditionalFilter {...initialProps} onChange={onChange} />);
      act(() => {
        userEvent.type(screen.getByRole('textbox', { name: 'text input' }), 'new-value');
      });
      expect(onChange).toHaveBeenLastCalledWith(expect.any(Object), 'new-value');
    });

    it('should open dropdown', async () => {
      render(<ConditionalFilter {...initialProps} items={config} />);
      await act(async () => {
        await userEvent.click(screen.getByRole('button', { name: 'Conditional filter toggle' }));
      });
      expect(screen.getByLabelText('Conditional filters list')).toBeDefined();
    });

    it('should call NOT call onChange when clicked on dropdown', async () => {
      const onChange = jest.fn();
      render(<ConditionalFilter {...initialProps} items={config} />);
      act(() => {
        userEvent.click(screen.getByRole('button', { name: 'Conditional filter toggle' }));
      });
      await act(async () => {
        userEvent.click(screen.getByRole('menuitem', { name: 'Simple text 1' }));
      });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should call call onChange when clicked on dropdown', async () => {
      const onChange = jest.fn();
      render(<ConditionalFilter {...initialProps} items={config} onChange={onChange} />);
      act(() => {
        userEvent.click(screen.getByRole('button', { name: 'Conditional filter toggle' }));
      });
      await act(async () => {
        await userEvent.click(screen.getByRole('menuitem', { name: 'Simple text 1' }));
      });
      expect(onChange).toHaveBeenCalled();
    });

    it('should update state on select', async () => {
      render(<ConditionalFilter {...initialProps} items={config} />);
      act(() => {
        userEvent.click(screen.getByRole('button', { name: 'Conditional filter toggle' }));
      });

      await act(async () => {
        await userEvent.click(screen.getByRole('menuitem', { name: 'Checkbox' }));
      });
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

      await act(async () => {
        await userEvent.click(screen.getByRole('button', { name: 'Group filter' }));
      });

      act(() => {
        userEvent.click(screen.getByLabelText('RHEL 7'));
      });
      expect(onChange).toHaveBeenCalledWith(
        expect.any(Object),
        { 'rhel-7': { 'rhel-7': true } },
        {
          groupSelectable: true,
          id: '',
          label: 'RHEL 7',
          type: 'checkbox',
          value: 'rhel-7',
          items: [
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
        },
        {
          className: 'pf-v6-u-pl-xs',
          groupSelectable: true,
          id: '',
          label: 'RHEL 7',
          type: 'checkbox',
          value: 'rhel-7',
          items: [
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
        },
        'rhel-7',
        'rhel-7'
      );
    });
  });
});
