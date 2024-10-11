import React from 'react';
import Pie from './Pie';
import { render } from '@testing-library/react';

describe('Pie component', () => {
  const values = [
    ['value1', 5],
    ['value2', 10],
    ['value3', 20],
    ['value4', 40],
  ];

  const identifier = 'test-pie';

  it('should render correctly', () => {
    const { container } = render(<Pie values={values} identifier={identifier} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with custom class', () => {
    const { container } = render(<Pie values={values} className="test pie" identifier={identifier} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with no legend', () => {
    const { container } = render(<Pie values={values} identifier={identifier} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with legend', () => {
    const { container } = render(<Pie values={values} identifier={identifier} withLegend />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with legend on the left', () => {
    const { container } = render(<Pie values={values} link="/foo/" identifier={identifier} withLegend legendPosition="left" />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with legend and links', () => {
    const { container } = render(<Pie values={values} link="/foo/" identifier={identifier} withLegend />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with legend on top and links', () => {
    const { container } = render(<Pie values={values} link="/foo/" identifier={identifier} withLegend legendPosition="top" />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with width and height of 300px, legend on top, with links', () => {
    const { container } = render(
      <Pie values={values} link="/foo/" identifier={identifier} withLegend legendPosition="top" height={300} width={300} />
    );
    expect(container).toMatchSnapshot();
  });

  // TODO: implement mouseover tests
});
