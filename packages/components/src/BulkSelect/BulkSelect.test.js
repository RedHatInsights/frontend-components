import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BulkSelect from './BulkSelect';
import { act } from 'react-dom/test-utils';

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

    it('should call on select', async () => {
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
      await act(async () => {
        await userEvent.click(screen.getByRole('checkbox', { name: 'Select all' }));
      });
      expect(onSelect).toHaveBeenCalled();
    });

    it('should NOT call on select', async () => {
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
      await act(async () => {
        await userEvent.click(screen.getByRole('checkbox', { name: 'Select all' }));
      });
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('should call first action', async () => {
      const onSelect = jest.fn();
      const otherAction = jest.fn();
      render(
        <BulkSelect
          items={[
            {
              title: 'Select all',
            },
            {
              title: 'Some action',
              onClick: otherAction,
            },
          ]}
          onSelect={onSelect}
        />
      );
      await act(async () => {
        await userEvent.click(screen.getByRole('checkbox', { name: 'Select all' }));
      });
      act(() => {
        userEvent.click(screen.getByRole('button', { expanded: true }));
      });
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
      expect(screen.getByRole('button', { expanded: false })).toBeDisabled();
    });

    it('should not override children passed in via toggleProps', () => {
      render(
        <BulkSelect
          items={[
            {
              title: 'Select all',
              onClick: jest.fn(),
            },
          ]}
          toggleProps={{
            children: ['10 selected'],
          }}
        />
      );

      expect(screen.getByRole('button', { name: '10 selected' })).toBeInTheDocument();
    });
  });
});
