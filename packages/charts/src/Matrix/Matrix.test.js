import React from 'react';
import Matrix from './Matrix';
import { render } from '@testing-library/react';

describe('Pie component', () => {
  const matrixData = {
    topRight: [{ position: [2, 2], label: 'First' }],
    topLeft: [{ position: [2, 2], label: 'Second' }],
    bottomRight: [{ position: [2, 2], label: 'Third' }],
    bottomLeft: [{ position: [2, 2], label: 'Fourth' }],
  };

  const matrixLabels = {
    yLabel: 'Y Axis Main Label',
    xLabel: 'X Axis Main Label',
    subLabels: {
      xLabels: ['X Axis Sub Label 1', 'X Axis Sub Label 2'],
      yLabels: ['Y Axis Sub Label 1', 'Y Axis Sub Label 2'],
    },
  };

  const matrixConfig = {
    max: 4,
    min: 0,
    size: 2,
    gridSize: 10,
    pad: 15,
    shift: 2,
    colors: ['yellow', 'blue', 'red', 'black'],
  };

  const identifier = 'test-matrix';

  it('should render correctly', () => {
    const { container } = render(<Matrix data={matrixData} identifier={identifier} />);
    expect(container).toMatchSnapshot();
  });

  it('should render with labels', () => {
    const { container } = render(<Matrix data={matrixData} label={matrixLabels} identifier={identifier} />);
    expect(container).toMatchSnapshot();
  });

  it('should render with config', () => {
    const { container } = render(<Matrix data={matrixData} label={matrixLabels} config={matrixConfig} identifier={identifier} />);
    expect(container).toMatchSnapshot();
  });
});
