import React from 'react';
import Radio from './RadioFilter';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const config = {
  items: [
    {
      label: <div>Custom value</div>,
      value: 'some-value',
      onChange: jest.fn(),
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

describe('Radio', () => {
  describe('render', () => {
    it('should render correctly', () => {
      const { container } = render(<Radio />);
      expect(container).toMatchSnapshot();
    });

    it('should render correctly with items', () => {
      const { container } = render(<Radio {...config} />);
      expect(container).toMatchSnapshot();
    });

    it('should render correctly with items - isDisabled', () => {
      const { container } = render(<Radio {...config} isDisabled />);
      expect(container).toMatchSnapshot();
    });

    it('should render correctly with items and default value', () => {
      const { container } = render(<Radio {...config} value="some-value" />);
      expect(container).toMatchSnapshot();
    });

    it('should render correctly with items and selected value', () => {
      const currectConfig = { ...config };
      currectConfig.items[1].isChecked = true;
      const { container } = render(<Radio {...currectConfig} />);
      expect(container).toMatchSnapshot();
    });

    it('should render correctly placeholder', () => {
      const { container } = render(<Radio {...config} placeholder="some placeholder" />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('API', () => {
    it('should open', () => {
      render(<Radio {...config} placeholder="some placeholder" />);
      userEvent.click(screen.getByRole('button', { name: 'Options menu' }));
      expect(screen.getByRole('listbox', { name: 'Select Input' })).toBeDefined();
    });

    it('should NOT call onChange', () => {
      const onChange = jest.fn();
      render(<Radio {...config} placeholder="some placeholder" />);
      userEvent.click(screen.getByRole('button', { name: 'Options menu' }));
      userEvent.click(screen.getByRole('option', { name: 'Custom value' }));
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should call onChange', () => {
      const onChange = jest.fn();
      render(<Radio {...config} onChange={onChange} placeholder="some placeholder" />);
      userEvent.click(screen.getByRole('button', { name: 'Options menu' }));
      userEvent.click(screen.getByRole('option', { name: 'Custom value' }));
      expect(onChange).toHaveBeenCalled();
    });

    it('should update selected', () => {
      const onChange = jest.fn();
      render(<Radio {...config} onChange={onChange} placeholder="some placeholder" />);
      userEvent.click(screen.getByRole('button', { name: 'Options menu' }));
      userEvent.click(screen.getByRole('option', { name: 'Custom value' }));
      expect(onChange.mock.calls[0][1]).toBe('some-value');
    });

    it('should update selected with default value', () => {
      const currectConfig = { ...config };
      currectConfig.items[1].isChecked = true;
      const onChange = jest.fn();
      render(<Radio {...currectConfig} onChange={onChange} placeholder="some placeholder" />);
      userEvent.click(screen.getByRole('button', { name: 'Options menu' }));
      userEvent.click(screen.getByRole('option', { name: 'Custom value' }));
      expect(onChange.mock.calls[0][1]).toBe('some-value');
    });
  });
});
