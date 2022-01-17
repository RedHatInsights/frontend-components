import React from 'react';
import CullingInformation from './CullingInformation';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('CullingInformation', () => {
  const currdate = new Date('Wed Feb 05 2020');
  const staleDate = new Date('Sun Jan 26 2020');
  const warningDate = new Date('Mon Feb 03 2020');
  const cullDate = new Date('Fri Feb 07 2020');
  test('it should render correctly without any date', () => {
    const wrapper = shallow(<CullingInformation currDate={currdate} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should render with dates - warning', () => {
    const wrapper = shallow(
      <CullingInformation stale={staleDate} currDate={currdate} culled={cullDate} staleWarning={warningDate}>
        Some children
      </CullingInformation>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should render with dates - danger', () => {
    const wrapper = shallow(
      <CullingInformation stale={staleDate} currDate={currdate} culled={currdate} staleWarning={warningDate}>
        Some children
      </CullingInformation>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should render with dates', () => {
    const wrapper = shallow(
      <CullingInformation stale={staleDate} culled={cullDate} staleWarning={warningDate} currDate={new Date('Tue Jan 28 2020')}>
        Some children
      </CullingInformation>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should render with dates - no tooltip', () => {
    const wrapper = shallow(
      <CullingInformation stale={staleDate} culled={cullDate} staleWarning={warningDate} currDate={new Date('Tue Jan 21 2020')}>
        Some children
      </CullingInformation>
    );
    expect(wrapper.find('Tooltip')).toHaveLength(0);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
