import React from 'react';
import { render, screen } from '@testing-library/react';
import OpenSourceBadge from './OpenSourceBadge';
import userEvent from '@testing-library/user-event';

describe('OpenSourceBadge component', () => {
  describe('should render', () => {
    it('badge', () => {
      const { container } = render(<OpenSourceBadge repositoryURL={'https://example.com'} />);
      expect(container).toMatchSnapshot();
    });

    it('popover', async () => {
      render(<OpenSourceBadge repositoryURL={'https://example.com'} />);
      userEvent.click(
        screen.getByRole('button', {
          name: /about open services/i,
        })
      );
      await screen.findByRole('dialog', {
        name: /about open source/i,
      });
    });
  });
});
