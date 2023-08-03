import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SimpleTableFilter from './SimpleTableFilter';
import { act } from 'react-dom/test-utils';

describe('SimpleTableFilter component', () => {
  describe('should render correctly', () => {
    it('with filter button', () => {
      const { container } = render(<SimpleTableFilter onFilterChange={jest.fn()} />);
      expect(container).toMatchSnapshot();
    });

    it('with custom filter button', () => {
      const { container } = render(<SimpleTableFilter onFilterChange={jest.fn()} buttonTitle="Custom title" />);
      expect(container).toMatchSnapshot();
    });

    it('with custom placeholder', () => {
      const { container } = render(<SimpleTableFilter onFilterChange={jest.fn()} placeholder="Custom placeholder" />);
      expect(container).toMatchSnapshot();
    });

    it('without filter button', () => {
      const { container } = render(<SimpleTableFilter onFilterChange={jest.fn()} />);
      expect(container).toMatchSnapshot();
    });

    it('with filter options', () => {
      const { container } = render(
        <SimpleTableFilter
          onFilterChange={jest.fn()}
          options={{
            title: 'Filter options',
            items: [{ value: 'one', title: 'one' }],
          }}
        />
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('API', () => {
    const onOptionSelect = jest.fn();
    const onButtonClick = jest.fn();
    const onFilterChange = jest.fn();

    describe('select actions', () => {
      beforeEach(() => {
        onOptionSelect.mockReset();
        onButtonClick.mockReset();
        onFilterChange.mockReset();
      });
      it('selecting should fire event', async () => {
        render(
          <SimpleTableFilter
            onFilterChange={jest.fn()}
            options={{
              title: 'Filter by',
              items: [{ value: 'one', title: 'one' }],
            }}
            onOptionSelect={onOptionSelect}
          />
        );

        act(() => {
          screen.getByRole('button', { expanded: false }).click();
        });
        await act(async () => {
          await screen.getByRole('menuitem').click();
        });
        expect(onOptionSelect.mock.calls.length).toBe(1);
        expect(onOptionSelect.mock.calls[0][1]).toMatchObject({ value: 'one' });
      });

      it('selecting should not fire event', async () => {
        render(
          <SimpleTableFilter
            onFilterChange={jest.fn()}
            onOptionSelect={onOptionSelect}
            options={{
              title: 'Filter by',
              items: [{ value: 'one', title: 'one' }],
            }}
          />
        );
        act(() => {
          screen.getByRole('button', { expanded: false }).click();
        });
        await act(async () => {
          await screen.getByRole('menuitem').click();
        });
        expect(onOptionSelect).toHaveBeenCalledTimes(1);
      });
    });

    describe('input actions', () => {
      afterEach(() => {
        onButtonClick.mockReset();
        onOptionSelect.mockReset();
        onFilterChange.mockReset();
      });
      it('typing should send events', () => {
        render(
          <SimpleTableFilter
            options={{
              title: 'Filter by',
              items: [{ value: 'one', title: 'one' }],
            }}
            onFilterChange={onFilterChange}
          />
        );
        userEvent.type(screen.getByLabelText('simple-table-filter'), '1');
        expect(onFilterChange).toHaveBeenCalledTimes(1);
        expect(onFilterChange).toHaveBeenLastCalledWith('1', undefined);
      });

      it('typing should not fire events', () => {
        render(
          <SimpleTableFilter
            onFilterChange={onFilterChange}
            options={{
              title: 'Filter by',
              items: [{ value: 'one', title: 'one' }],
            }}
          />
        );
        act(() => {
          userEvent.type(screen.getByLabelText('simple-table-filter'), '1');
        });
        expect(onFilterChange).toHaveBeenCalledTimes(1);
      });

      it('typing should send selected and input', async () => {
        render(
          <SimpleTableFilter
            options={{
              title: 'Filter by',
              items: [{ value: 'one', title: 'one' }],
            }}
            onFilterChange={onFilterChange}
          />
        );

        act(() => {
          screen.getByRole('button', { expanded: false }).click();
        });
        await act(async () => {
          await screen.getByRole('menuitem').click();
        });
        act(() => {
          userEvent.type(screen.getByLabelText('simple-table-filter'), '1');
        });
        expect(onFilterChange).toHaveBeenCalledTimes(1);
        expect(onFilterChange).toHaveBeenLastCalledWith('1', { title: 'one', value: 'one' });
      });

      it('enter should trigger new filter change', async () => {
        render(
          <SimpleTableFilter
            options={{
              title: 'Filter by',
              items: [{ value: 'one', title: 'one' }],
            }}
            onFilterChange={onFilterChange}
          />
        );

        act(() => {
          screen.getByRole('button', { expanded: false }).click();
        });
        await act(async () => {
          await screen.getByRole('menuitem').click();
        });
        act(() => {
          userEvent.type(screen.getByLabelText('simple-table-filter'), '1');
        });
        expect(onFilterChange).toHaveBeenCalledTimes(1);
        screen.getByLabelText('simple-table-filter').focus();
        userEvent.keyboard('{enter}');
        expect(onFilterChange).toHaveBeenCalledTimes(2);
      });
    });

    describe('Button click', () => {
      afterEach(() => {
        onButtonClick.mockReset();
        onOptionSelect.mockReset();
        onFilterChange.mockReset();
      });
      it('should send input data', async () => {
        render(
          <SimpleTableFilter
            options={{
              title: 'Filter by',
              items: [{ value: 'one', title: 'one' }],
            }}
            onButtonClick={onButtonClick}
            onFilterChange={onFilterChange}
          />
        );
        act(() => {
          userEvent.type(screen.getByLabelText('simple-table-filter'), '1');
        });
        screen.getByText('Filter').click();
        expect(onButtonClick).toHaveBeenCalledTimes(1);
        expect(onButtonClick).toHaveBeenCalledWith('1', undefined);
      });

      it('should not send input data', async () => {
        render(
          <SimpleTableFilter
            onFilterChange={onFilterChange}
            onButtonClick={onButtonClick}
            options={{
              title: 'Filter by',
              items: [{ value: 'one', title: 'one' }],
            }}
          />
        );

        act(() => {
          userEvent.type(screen.getByLabelText('simple-table-filter'), '1');
        });
        screen.getByText('Filter').click();
        expect(onButtonClick).toHaveBeenCalledTimes(1);
      });

      it('should send input data and select', async () => {
        render(
          <SimpleTableFilter
            options={{
              title: 'Filter by',
              items: [{ value: 'one', title: 'one' }],
            }}
            onFilterChange={onFilterChange}
            onButtonClick={onButtonClick}
          />
        );

        act(() => {
          screen.getByRole('button', { expanded: false }).click();
        });
        await act(async () => {
          await screen.getByRole('menuitem').click();
        });
        act(() => {
          userEvent.type(screen.getByLabelText('simple-table-filter'), '1');
        });
        screen.getByText('Filter').click();
        expect(onButtonClick).toHaveBeenCalledTimes(1);
        expect(onButtonClick).toHaveBeenCalledWith('1', { title: 'one', value: 'one' });
      });
    });
  });
});
