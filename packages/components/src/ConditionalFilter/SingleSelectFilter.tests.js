import React from 'react';
import userEvent from '@testing-library/user-event';
import SingleSelectFilter from './SingleSelectFilter';
import { render, screen, waitFor, within } from '@testing-library/react';

const items = [
  { value: 'op1', label: 'option 1' },
  { value: 'op2', label: 'option 2' },
  { value: 'op3', label: 'option 3' },
];
const filterId = 'my-filter';
const setFilterData = jest.fn();

describe('SingleSelectFilter component', () => {
  it('Should handle select values', async () => {
    render(<SingleSelectFilter onChange={setFilterData} items={items} placeholder="placeholder" value={items[0].value} />);

    await waitFor(() =>
      userEvent.click(
        screen.getByRole('button', {
          name: /option 1/i,
        })
      )
    );

    const option1 = screen.getByRole('option', {
      name: /option 1/i,
    });
    const option2 = screen.getByRole('option', {
      name: /option 2/i,
    });
    const option3 = screen.getByRole('option', {
      name: /option 3/i,
    });

    expect(
      within(option1).getByRole('img', {
        hidden: true,
      })
    ).toBeTruthy();
    expect(
      within(option2).queryByRole('img', {
        hidden: true,
      })
    ).toBeFalsy();
    expect(
      within(option3).queryByRole('img', {
        hidden: true,
      })
    ).toBeFalsy();

    await waitFor(() => userEvent.click(option2));

    expect(setFilterData).toHaveBeenCalledWith(items[1].value);
  });
});
