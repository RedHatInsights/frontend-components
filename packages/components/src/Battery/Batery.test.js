import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
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
        const wrapper = shallow(<Battery severity={severity} label={`${severity}`} />);
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    ['high', 'error', 3].forEach((severity) => {
      it(`HighBattery - ${severity}`, () => {
        const wrapper = shallow(<Battery severity={severity} label={`${severity}`} />);
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    ['medium', 'warn', 2].forEach((severity) => {
      it(`MediumBattery - ${severity}`, () => {
        const wrapper = shallow(<Battery severity={severity} label={`${severity}`} />);
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    ['low', 'info', 1].forEach((severity) => {
      it(`LowBattery - ${severity}`, () => {
        const wrapper = shallow(<Battery severity={severity} label={`${severity}`} />);
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    it('NullBatery, default', () => {
      const wrapper = shallow(<Battery severity={''} label={''} />);
      expect(toJson(wrapper)).toMatchSnapshot();
      expect(console.error).toBeCalled();
    });
  });

  describe('API', () => {
    it('should hide label', () => {
      const wrapper = shallow(<Battery severity={'high'} label={'high'} labelHidden />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  it(`CriticalBattery`, () => {
    const wrapper = shallow(<CriticalBattery />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it(`HighBattery`, () => {
    const wrapper = shallow(<HighBattery />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it(`MediumBattery`, () => {
    const wrapper = shallow(<MediumBattery />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it(`LowBattery`, () => {
    const wrapper = shallow(<LowBattery />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it(`NullBattery`, () => {
    const wrapper = shallow(<NullBattery />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
