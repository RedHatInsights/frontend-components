import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Donut from './Donut';

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
    const wrapper = shallow(<Donut values={values} identifier={identifier} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with no legend', () => {
    const wrapper = shallow(<Donut values={values} totalLabel={totalLabel} identifier={identifier} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with legend', () => {
    const wrapper = shallow(<Donut values={values} totalLabel={totalLabel} identifier={identifier} withLegend />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with legend on the left', () => {
    const wrapper = shallow(<Donut values={values} link="/foo/" totalLabel={totalLabel} identifier={identifier} withLegend legendPosition="left" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with legend and links', () => {
    const wrapper = shallow(<Donut values={values} link="/foo/" totalLabel={totalLabel} identifier={identifier} withLegend />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with legend on top and links', () => {
    const wrapper = shallow(<Donut values={values} link="/foo/" totalLabel={totalLabel} identifier={identifier} withLegend legendPosition="top" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with width and height of 300px, legend on top, with links', () => {
    const wrapper = shallow(
      <Donut values={values} link="/foo/" totalLabel={totalLabel} identifier={identifier} withLegend legendPosition="top" height={300} width={300} />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  // TODO: implement mouseover tests
});
