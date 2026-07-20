import React from 'react';
import TableWithFilter from './TableWithFilter';
import { render } from '@testing-library/react';

describe('TableWithFilter', () => {
  describe('should render', () => {
    it('without data', () => {
      const { container } = render(<TableWithFilter />);
      expect(container).toMatchSnapshot();
    });

    it('loading and pagination', () => {
      const onUpdateData = jest.fn();
      const { container } = render(
        <TableWithFilter
          loaded={false}
          rows={[['one']]}
          columns={[{ title: 'something' }]}
          pagination={{
            page: 1,
          }}
          onUpdateData={onUpdateData}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('with data', () => {
      const { container } = render(<TableWithFilter loaded rows={[['one']]} columns={[{ title: 'something' }]} />);
      expect(container).toMatchSnapshot();
    });

    it('with data and pagination', () => {
      const onUpdateData = jest.fn();
      const { container } = render(
        <TableWithFilter
          loaded
          rows={[['one']]}
          columns={[{ title: 'something' }]}
          pagination={{
            page: 1,
          }}
          onUpdateData={onUpdateData}
        />,
      );
      expect(container).toMatchSnapshot();
    });
    it('with data and filters', () => {
      const onUpdateData = jest.fn();
      const { container } = render(
        <TableWithFilter
          loaded
          rows={[['one']]}
          columns={[{ title: 'something' }]}
          filters={[{ type: 'text', something: '1' }]}
          onUpdateData={onUpdateData}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('with data and bulk select without calculate checked', () => {
      const onUpdateData = jest.fn();
      const onSelect = jest.fn();
      const { container } = render(
        <TableWithFilter
          loaded
          rows={[['one']]}
          columns={[{ title: 'something' }]}
          pagination={{
            page: 1,
          }}
          onUpdateData={onUpdateData}
          onSelect={onSelect}
          selected={[]}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('with data and bulk select with calculate checked', () => {
      const onUpdateData = jest.fn();
      const onSelect = jest.fn();
      const calculateChecked = jest.fn();
      const { container } = render(
        <TableWithFilter
          loaded
          rows={[['one']]}
          columns={[{ title: 'something' }]}
          pagination={{
            page: 1,
          }}
          onUpdateData={onUpdateData}
          onSelect={onSelect}
          calculateChecked={calculateChecked}
          selected={[]}
        />,
      );
      expect(container).toMatchSnapshot();
      expect(calculateChecked).toHaveBeenCalled();
    });
  });
});
