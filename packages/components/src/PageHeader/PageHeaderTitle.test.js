import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageHeaderTitle from './PageHeaderTitle';

describe('PageHeader component', () => {
  it('should render', () => {
    const { container } = render(<PageHeaderTitle title="Something" />);
    expect(container).toMatchSnapshot();
  });

  it('renders children correctly', () => {
    const title = 'Test Title';
    const actionsContent = 'Actions content';
    render(<PageHeaderTitle title={title} actionsContent={actionsContent} />);
    expect(screen.getByText(actionsContent)).toBeInTheDocument();
  });
});
