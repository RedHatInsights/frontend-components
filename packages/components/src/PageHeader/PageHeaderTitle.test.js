import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageHeaderTitle from './PageHeaderTitle';

describe('PageHeader component', () => {
  it('should render', () => {
    const wrapper = mount(<PageHeaderTitle title="Something" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders children correctly', () => {
    const title = 'Test Title';
    const actionsContent = 'Actions content';
    render(<PageHeaderTitle title={title} actionsContent={actionsContent} />);
    expect(screen.getByText(actionsContent)).toBeInTheDocument();
  });
});
