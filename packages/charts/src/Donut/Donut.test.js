import React from 'react';
import Donut from './Donut';
import { render } from '@testing-library/react';

describe('Donut component', () => {
  const values = [
    ['value1', 5],
    ['value2', 10],
    ['value3', 20],
    ['value4', 40],
  ];

  const totalLabel = 'label for donut hole';
  const identifier = 'test-donut';

  it('should render correctly', () => {
    const { container } = render(<Donut values={values} identifier={identifier} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with no legend', () => {
    const { container } = render(<Donut values={values} totalLabel={totalLabel} identifier={identifier} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with legend', () => {
    const { container } = render(<Donut values={values} totalLabel={totalLabel} identifier={identifier} withLegend />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with legend on the left', () => {
    const { container } = render(
      <Donut values={values} link="/foo/" totalLabel={totalLabel} identifier={identifier} withLegend legendPosition="left" />
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with legend and links', () => {
    const { container } = render(<Donut values={values} link="/foo/" totalLabel={totalLabel} identifier={identifier} withLegend />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with legend on top and links', () => {
    const { container } = render(
      <Donut values={values} link="/foo/" totalLabel={totalLabel} identifier={identifier} withLegend legendPosition="top" />
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with width and height of 300px, legend on top, with links', () => {
    const { container } = render(
      <Donut values={values} link="/foo/" totalLabel={totalLabel} identifier={identifier} withLegend legendPosition="top" height={300} width={300} />
    );
    expect(container).toMatchSnapshot();
  });

  // TODO: implement mouseover tests
});
