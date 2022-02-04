import React from 'react';
import { render } from '@testing-library/react';
import Battery from './Battery';
import CriticalBattery from './CriticalBattery';
import HighBattery from './HighBattery';
import MediumBattery from './MediumBattery';
import LowBattery from './LowBattery';
import NullBattery from './NullBattery';

describe('Battery component', () => {
  jest.spyOn(global.console, 'error');
  describe('should render correctly', () => {
    ['critical', 4].forEach((severity) => {
      it(`CriticalBattery - ${severity}`, () => {
        const { container } = render(<Battery severity={severity} label={`${severity}`} />);
        expect(container).toMatchSnapshot();
      });
    });

    ['high', 'error', 3].forEach((severity) => {
      it(`HighBattery - ${severity}`, () => {
        const { container } = render(<Battery severity={severity} label={`${severity}`} />);
        expect(container).toMatchSnapshot();
      });
    });

    ['medium', 'warn', 2].forEach((severity) => {
      it(`MediumBattery - ${severity}`, () => {
        const { container } = render(<Battery severity={severity} label={`${severity}`} />);
        expect(container).toMatchSnapshot();
      });
    });

    ['low', 'info', 1].forEach((severity) => {
      it(`LowBattery - ${severity}`, () => {
        const { container } = render(<Battery severity={severity} label={`${severity}`} />);
        expect(container).toMatchSnapshot();
      });
    });

    it('NullBatery, default', () => {
      const { container } = render(<Battery severity={''} label={''} />);
      expect(container).toMatchSnapshot();
      expect(console.error).toBeCalled();
    });
  });

  describe('API', () => {
    it('should hide label', () => {
      const { container } = render(<Battery severity={'high'} label={'high'} labelHidden />);
      expect(container).toMatchSnapshot();
    });
  });

  it(`CriticalBattery`, () => {
    const { container } = render(<CriticalBattery />);
    expect(container).toMatchSnapshot();
  });

  it(`HighBattery`, () => {
    const { container } = render(<HighBattery />);
    expect(container).toMatchSnapshot();
  });

  it(`MediumBattery`, () => {
    const { container } = render(<MediumBattery />);
    expect(container).toMatchSnapshot();
  });

  it(`LowBattery`, () => {
    const { container } = render(<LowBattery />);
    expect(container).toMatchSnapshot();
  });

  it(`NullBattery`, () => {
    const { container } = render(<NullBattery />);
    expect(container).toMatchSnapshot();
  });
});
