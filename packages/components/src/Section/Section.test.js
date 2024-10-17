import React from 'react';
import Section from './Section';
import { render } from '@testing-library/react';

describe('Section component', () => {
  it('should render correctly', () => {
    const { container } = render(<Section type="page">Test</Section>);
    expect(container).toMatchSnapshot();
  });
});
