import React from 'react';
import columns from './__fixtures__/columns';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ColumnManager from './ColumnManager';

const renderJson = (component) => toJson(shallow(component));

describe('ColumnManager', () => {
  it('expect to render without error and only columns with key', () => {
    expect(renderJson(<ColumnManager columns={columns} />)).toMatchSnapshot();
  });

  it('expect to render without error and all columns', () => {
    expect(renderJson(<ColumnManager columns={columns} selectProp="title" />)).toMatchSnapshot();
  });

  it('expect to render with custom action labels', () => {
    expect(renderJson(<ColumnManager columns={columns} saveLabel="SAVE" closeLabel="CLOSING" selectAllLabel="SELECT EM ALL" />)).toMatchSnapshot();
  });

  it('expect to render with custom title', () => {
    expect(renderJson(<ColumnManager columns={columns} title="TEST TITLE" />)).toMatchSnapshot();
  });

  it('expect to render with all column checkboxes disabled', () => {
    const allColumnsRequired = columns.map((column) => ({ ...column, isRequired: true }));
    expect(renderJson(<ColumnManager columns={allColumnsRequired} />)).toMatchSnapshot();
  });
});
