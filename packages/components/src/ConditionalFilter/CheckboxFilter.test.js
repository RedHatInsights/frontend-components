import React from 'react';
import Checkbox from './CheckboxFilter';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const config = {
  items: [
    {
      onClick: jest.fn(),
      label: <div>Custom value</div>,
      value: 'some-value',
    },
    {
      label: 'Another',
      value: 'another-value',
    },
    {
      label: 'No value',
    },
  ],
};

describe('Checkbox', () => {
  describe('render', () => {
    it('should render correctly', () => {
      const { container } = render(<Checkbox />);
      expect(container).toMatchSnapshot();
    });

    it('should render correctly - disabled', () => {
      const { container } = render(<Checkbox {...config} isDisabled />);
      expect(container).toMatchSnapshot();
    });

    it('should render correctly with items', () => {
      const { container } = render(<Checkbox {...config} />);
      expect(container).toMatchSnapshot();
    });

    it('should render correctly with items and default value', () => {
      const { container } = render(<Checkbox {...config} value={['some-value']} />);
      expect(container).toMatchSnapshot();
    });

    it('should render correctly with items and default object value', () => {
      const { container } = render(<Checkbox {...config} value={[{ value: 'some-value' }]} />);
      expect(container).toMatchSnapshot();
    });

    it('should render correctly with items and selected value', () => {
      const currectConfig = { ...config };
      currectConfig.items[1].isChecked = true;
      const { container } = render(<Checkbox {...currectConfig} />);
      expect(container).toMatchSnapshot();
    });

    it('should render correctly placeholder', () => {
      const { container } = render(<Checkbox {...config} placeholder="some placeholder" />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('API', () => {
    it('should open', async () => {
      render(<Checkbox {...config} placeholder="some placeholder" />);
      await act(async () => await userEvent.click(screen.getByRole('button', { name: 'Options menu' })));
      expect(screen.getByRole('menu', { name: 'Options menu' })).toBeDefined();
    });

    it('should NOT call onChange', async () => {
      const onChange = jest.fn();
      render(<Checkbox {...config} placeholder="some placeholder" />);
      await act(async () => await userEvent.click(screen.getByRole('button', { name: 'Options menu' })));
      act(() => {
        userEvent.click(screen.getByRole('checkbox', { name: 'Custom value' }));
      });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should call onChange', async () => {
      const onChange = jest.fn();
      render(<Checkbox {...config} onChange={onChange} placeholder="some placeholder" />);
      await act(async () => await userEvent.click(screen.getByRole('button', { name: 'Options menu' })));
      act(() => {
        userEvent.click(screen.getByRole('checkbox', { name: 'Custom value' }));
      });
      expect(onChange).toHaveBeenCalled();
    });

    it('should call onClick on item', async () => {
      render(<Checkbox {...config} placeholder="some placeholder" />);
      await act(async () => await userEvent.click(screen.getByRole('button', { name: 'Options menu' })));
      act(() => {
        userEvent.click(screen.getByRole('checkbox', { name: 'Custom value' }));
      });
      expect(config.items[0].onClick).toHaveBeenCalled();
    });

    it('should update selected', async () => {
      render(<Checkbox {...config} placeholder="some placeholder" />);
      await act(async () => await userEvent.click(screen.getByRole('button', { name: 'Options menu' })));
      act(() => {
        userEvent.click(screen.getByRole('checkbox', { name: 'Custom value' }));
      });
      expect(screen.getByRole('checkbox', { name: 'Custom value' }).checked).toBe(true);
    });

    it('should update selected with default value', async () => {
      render(<Checkbox {...config} value={[{ value: 'another-value' }]} placeholder="some placeholder" />);
      await act(async () => {
        await userEvent.click(screen.getByRole('button', { name: 'Options menu' }));
      });

      act(() => {
        userEvent.click(screen.getByRole('checkbox', { name: 'Custom value' }));
      });
      expect(screen.getByRole('checkbox', { name: 'Custom value' }).checked).toBe(true);
      expect(screen.getByRole('checkbox', { name: 'Another' }).checked).toBe(true);
    });
  });
});
