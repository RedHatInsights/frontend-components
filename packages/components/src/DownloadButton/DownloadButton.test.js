import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DownloadButton from './DownloadButton';
import { DropdownItem } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { act } from 'react-dom/test-utils';

const extraItems = [<DropdownItem key="extra-1" component="button"></DropdownItem>];

describe('DownloadButton component', () => {
  describe('should render', () => {
    it('CSV and JSON by default', () => {
      const { container } = render(<DownloadButton />);
      expect(container).toMatchSnapshot();
    });

    it('custom items', () => {
      const { container } = render(<DownloadButton extraItems={extraItems} />);
      expect(container).toMatchSnapshot();
    });

    it('disabled', () => {
      const { container } = render(<DownloadButton extraItems={extraItems} isDisabled />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('API', () => {
    it('clicking should open dropdown', async () => {
      const { container } = render(<DownloadButton extraItems={extraItems} />);
      await act(async () => {
        userEvent.click(screen.getByRole('button', { name: 'Export' }));
      });
      expect(container).toMatchSnapshot();
    });

    it('onSelect should be called with CSV', async () => {
      const onSelect = jest.fn();
      render(<DownloadButton extraItems={extraItems} onSelect={onSelect} />);
      await act(async () => {
        userEvent.click(screen.getByRole('button', { name: 'Export' }));
      });

      act(() => {
        userEvent.click(screen.getByRole('menuitem', { name: 'Export to CSV' }));
      });
      expect(onSelect.mock.calls.length).toBe(1);
      expect(onSelect.mock.calls[0][1]).toBe('csv');
    });

    it('onSelect should be called with JSON', async () => {
      const onSelect = jest.fn();
      render(<DownloadButton extraItems={extraItems} onSelect={onSelect} />);
      await act(async () => {
        userEvent.click(screen.getByRole('button', { name: 'Export' }));
      });

      act(() => {
        userEvent.click(screen.getByRole('menuitem', { name: 'Export to JSON' }));
      });
      expect(onSelect.mock.calls.length).toBe(1);
      expect(onSelect.mock.calls[0][1]).toBe('json');
    });

    it("shouldn't call onSelect", async () => {
      const onSelect = jest.fn();
      render(<DownloadButton extraItems={extraItems} />);
      await act(async () => {
        userEvent.click(screen.getByRole('button', { name: 'Export' }));
      });

      act(() => {
        userEvent.click(screen.getByRole('menuitem', { name: 'Export to JSON' }));
      });
      expect(onSelect.mock.calls.length).toBe(0);
    });
  });
});
