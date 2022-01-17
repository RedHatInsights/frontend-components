import React from 'react';
import TableWithFilter from './TableWithFilter';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('TableWithFilter', () => {
  describe('should render', () => {
    it('without data', () => {
      const wrapper = shallow(<TableWithFilter />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('loading and pagination', () => {
      const onUpdateData = jest.fn();
      const wrapper = shallow(
        <TableWithFilter
          loaded={false}
          rows={[['one']]}
          columns={[{ title: 'something' }]}
          pagination={{
            page: 1,
          }}
          onUpdateData={onUpdateData}
        />
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('with data', () => {
      const wrapper = shallow(<TableWithFilter loaded rows={[['one']]} columns={[{ title: 'something' }]} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('with data and pagination', () => {
      const onUpdateData = jest.fn();
      const wrapper = shallow(
        <TableWithFilter
          loaded
          rows={[['one']]}
          columns={[{ title: 'something' }]}
          pagination={{
            page: 1,
          }}
          onUpdateData={onUpdateData}
        />
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('with data and filters', () => {
      const onUpdateData = jest.fn();
      const wrapper = shallow(
        <TableWithFilter loaded rows={[['one']]} columns={[{ title: 'something' }]} filters={[{ something: '1' }]} onUpdateData={onUpdateData} />
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('with data and bulk select without calculate checked', () => {
      const onUpdateData = jest.fn();
      const onSelect = jest.fn();
      const wrapper = shallow(
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
        />
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('with data and bulk select with calculate checked', () => {
      const onUpdateData = jest.fn();
      const onSelect = jest.fn();
      const calculateChecked = jest.fn();
      const wrapper = shallow(
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
        />
      );
      expect(toJson(wrapper)).toMatchSnapshot();
      expect(calculateChecked).toHaveBeenCalled();
    });
  });
});
