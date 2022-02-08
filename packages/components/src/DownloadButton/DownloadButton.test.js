import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DownloadButton from './DownloadButton';
import { DropdownItem } from '@patternfly/react-core';

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
    it('clicking should open dropdown', () => {
      const { container } = render(<DownloadButton extraItems={extraItems} />);
      userEvent.click(screen.getByRole('button', { name: 'Export' }));
      expect(container).toMatchSnapshot();
    });

    it('onSelect should be called with CSV', () => {
      const onSelect = jest.fn();
      render(<DownloadButton extraItems={extraItems} onSelect={onSelect} />);
      userEvent.click(screen.getByRole('button', { name: 'Export' }));
      userEvent.click(screen.getByRole('menuitem', { name: 'Export to CSV' }));
      expect(onSelect.mock.calls.length).toBe(1);
      expect(onSelect.mock.calls[0][1]).toBe('csv');
    });

    it('onSelect should be called with JSON', () => {
      const onSelect = jest.fn();
      render(<DownloadButton extraItems={extraItems} onSelect={onSelect} />);
      userEvent.click(screen.getByRole('button', { name: 'Export' }));
      userEvent.click(screen.getByRole('menuitem', { name: 'Export to JSON' }));
      expect(onSelect.mock.calls.length).toBe(1);
      expect(onSelect.mock.calls[0][1]).toBe('json');
    });

    it("shouldn't call onSelect", () => {
      const onSelect = jest.fn();
      render(<DownloadButton extraItems={extraItems} />);
      userEvent.click(screen.getByRole('button', { name: 'Export' }));
      userEvent.click(screen.getByRole('menuitem', { name: 'Export to JSON' }));
      expect(onSelect.mock.calls.length).toBe(0);
    });
  });
});
