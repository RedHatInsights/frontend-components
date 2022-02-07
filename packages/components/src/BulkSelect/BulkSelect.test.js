import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BulkSelect from './BulkSelect';

describe('BulkSelect', () => {
  it('should render correctly - no data', () => {
    const { container } = render(<BulkSelect />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly', () => {
    const { container } = render(
      <BulkSelect
        count={30}
        items={[
          {
            title: 'Select all',
            onClick: jest.fn(),
          },
        ]}
        id="some-id"
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly', () => {
    const { container } = render(
      <BulkSelect
        items={[
          {
            title: 'Select all',
            onClick: jest.fn(),
          },
        ]}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly - null checked', () => {
    const { container } = render(
      <BulkSelect
        items={[
          {
            title: 'Select all',
            onClick: jest.fn(),
          },
        ]}
        checked={null}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('should render custom props', () => {
    const { container } = render(
      <BulkSelect
        items={[
          {
            title: 'Select none',
            onClick: jest.fn(),
            props: {
              isDisabled: true,
            },
          },
          {
            title: 'Select all',
            onClick: jest.fn(),
          },
        ]}
      />
    );
    expect(container).toMatchSnapshot();
  });

  describe('API', () => {
    it('should call on select with no items', () => {
      const onSelect = jest.fn();
      render(<BulkSelect onSelect={onSelect} />);
      userEvent.click(screen.getByRole('checkbox', { name: 'Select all' }));
      expect(onSelect).toHaveBeenCalled();
    });

    it('should call on select', () => {
      const onSelect = jest.fn();
      render(
        <BulkSelect
          items={[
            {
              title: 'Select all',
              onClick: jest.fn(),
            },
          ]}
          onSelect={onSelect}
        />
      );
      userEvent.click(screen.getByRole('checkbox', { name: 'Select all' }));
      expect(onSelect).toHaveBeenCalled();
    });

    it('should NOT call on select', () => {
      const onSelect = jest.fn();
      render(
        <BulkSelect
          items={[
            {
              title: 'Select all',
              onClick: jest.fn(),
            },
          ]}
        />
      );
      userEvent.click(screen.getByRole('checkbox', { name: 'Select all' }));
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('should call first action', () => {
      const onSelect = jest.fn();
      const otherAction = jest.fn();
      render(
        <BulkSelect
          items={[
            {
              title: 'Select all',
              onClick: onSelect,
            },
            {
              title: 'Some action',
              onClick: otherAction,
            },
          ]}
        />
      );
      userEvent.click(screen.getByRole('button', { name: 'Select' }));
      userEvent.click(screen.getByRole('button', { name: 'Select all' }));
      expect(onSelect).toHaveBeenCalled();
      expect(otherAction).not.toHaveBeenCalled();
    });

    it('should disable dropdown', () => {
      render(
        <BulkSelect
          items={[
            {
              title: 'Select all',
              onClick: jest.fn(),
            },
          ]}
          isDisabled={true}
        />
      );
      expect(screen.getByRole('button', { name: 'Select' })).toBeDisabled();
    });
  });
});
