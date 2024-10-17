import React from 'react';
import Gauge from './Gauge';
import { render } from '@testing-library/react';

describe('Gauge component', () => {
  const label = 'gauge label';
  const identifier = 'gauge-identifier';

  it('should render correctly', () => {
    const { container } = render(<Gauge value={10} label={label} identifier={identifier} />);
    expect(container).toMatchSnapshot();
  });

  [0, 25, 50, 75, 100].forEach((value) => {
    it(`Value- ${value}`, () => {
      const { container } = render(<Gauge value={value} identifier={identifier} label={label} />);
      expect(container).toMatchSnapshot();
    });
  });

  [0, 25, 50, 75, 100].forEach((value) => {
    it(`Value- ${value} - flipped colors`, () => {
      const { container } = render(<Gauge value={value} identifier={identifier} label={label} flipFullColors />);
      expect(container).toMatchSnapshot();
    });
  });

  it('should render correctly with identifier', () => {
    const { container } = render(<Gauge value={10} identifier={identifier} label={label} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with width and height of 300', () => {
    const { container } = render(<Gauge value={10} height={300} width={300} identifier={identifier} label={label} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with added classes', () => {
    const { container } = render(<Gauge value={10} className="addedClass" identifier={identifier} label={label} />);
    expect(container).toMatchSnapshot();
  });

  // TODO: implement mouseover tests
});
