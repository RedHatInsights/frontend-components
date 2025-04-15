import React from 'react';
import { render } from '@testing-library/react';
import Dark from './Dark';
import DarkContext from './DarkContext';

describe('DarkContext', () => {
  it('should render children', () => {
    const { container } = render(
      <Dark>
        <div id="isPresent" />
      </Dark>,
    );

    expect(container).toMatchSnapshot();
    expect(container.querySelector('#isPresent')).toBeDefined();
  });

  it('should pass props', () => {
    const { container } = render(
      <Dark>
        <DarkContext.Consumer>{(value) => <div value={value} id="consumer" />}</DarkContext.Consumer>
      </Dark>,
    );
    expect(container).toMatchSnapshot();
  });
});
