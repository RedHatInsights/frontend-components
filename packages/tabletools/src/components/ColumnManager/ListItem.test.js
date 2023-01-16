import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import columns from './__fixtures__/columns';
import ListItem from './ListItem';

describe('ListItem', () => {
  it('expect to render without error', () => {
    expect(toJson(shallow(<ListItem column={columns[0]} />))).toMatchSnapshot();
  });
});
