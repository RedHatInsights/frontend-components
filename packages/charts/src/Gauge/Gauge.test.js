import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Gauge from './Gauge';

describe('Gauge component', () => {
  const label = 'gauge label';
  const identifier = 'gauge-identifier';

  it('should render correctly', () => {
    const wrapper = shallow(<Gauge value={10} label={label} identifier={identifier} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  [0, 25, 50, 75, 100].forEach((value) => {
    it(`Value- ${value}`, () => {
      const wrapper = shallow(<Gauge value={value} identifier={identifier} label={label} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  [0, 25, 50, 75, 100].forEach((value) => {
    it(`Value- ${value} - flipped colors`, () => {
      const wrapper = shallow(<Gauge value={value} identifier={identifier} label={label} flipFullColors />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  it('should render correctly with identifier', () => {
    const wrapper = shallow(<Gauge value={10} identifier={identifier} label={label} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with width and height of 300', () => {
    const wrapper = shallow(<Gauge value={10} height={300} width={300} identifier={identifier} label={label} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with added classes', () => {
    const wrapper = shallow(<Gauge value={10} className="addedClass" identifier={identifier} label={label} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  // TODO: implement mouseover tests
});
