import React from 'react';
import Text from './TextFilter';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Text component', () => {
  describe('render', () => {
    it('should render correctly', () => {
      const { container } = render(<Text id="test-id" />);
      expect(container).toMatchSnapshot();
    });

    it('should render correctly - isDisabled', () => {
      const { container } = render(<Text id="test-id" isDisabled />);
      expect(container).toMatchSnapshot();
    });

    it('should render placeholder', () => {
      const { container } = render(<Text id="test-id" placeholder="some-placeholder" />);
      expect(container).toMatchSnapshot();
    });

    it('should render value', () => {
      const { container } = render(<Text id="test-id" value="some-value" />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('API', () => {
    it('should NOT call onSubmit', () => {
      const onSubmit = jest.fn();
      render(<Text id="test-id" value="some-value" />);
      userEvent.type(screen.getByRole('textbox', { name: 'text input' }), '{enter}');
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should call onSubmit', () => {
      const onSubmit = jest.fn();
      render(<Text id="test-id" value="some-value" onSubmit={onSubmit} />);
      userEvent.type(screen.getByRole('textbox', { name: 'text input' }), '{enter}');
      expect(onSubmit).toHaveBeenCalled();
      expect(onSubmit.mock.calls[0][1]).toBe('some-value');
    });

    it('should update state', () => {
      render(<Text id="test-id" />);
      userEvent.type(screen.getByRole('textbox', { name: 'text input' }), 'new-value');
      expect(screen.getByRole('textbox', { name: 'text input' }).value).toBe('new-value');
    });

    it('should call on submit with state value', () => {
      const onSubmit = jest.fn();
      render(<Text id="test-id" onSubmit={onSubmit} />);
      userEvent.type(screen.getByRole('textbox', { name: 'text input' }), 'new-value');
      userEvent.type(screen.getByRole('textbox', { name: 'text input' }), '{enter}');
      expect(onSubmit).toHaveBeenCalled();
    });

    it('should call onChange', () => {
      const onChange = jest.fn();
      render(<Text id="test-id" value="some-value" onChange={onChange} />);
      userEvent.type(screen.getByRole('textbox', { name: 'text input' }), 'new-value');
      expect(onChange).toHaveBeenCalled();
    });
  });
});
