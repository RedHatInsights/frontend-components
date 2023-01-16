import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { NoResultsTable } from './NoResultsTable';

describe('NoResultsTable', () => {
  it('expect to render without error', () => {
    expect(toJson(shallow(<NoResultsTable />))).toMatchSnapshot();
  });
});
