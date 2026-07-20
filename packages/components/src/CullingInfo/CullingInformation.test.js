import React from 'react';
import CullingInformation from './CullingInformation';
import { render } from '@testing-library/react';

describe('CullingInformation', () => {
  const currdate = new Date('Wed Feb 05 2020');
  const staleDate = new Date('Sun Jan 26 2020');
  const warningDate = new Date('Mon Feb 03 2020');
  const cullDate = new Date('Fri Feb 07 2020');
  test('it should render correctly without any date', () => {
    const { container } = render(<CullingInformation currDate={currdate} />);
    expect(container).toMatchSnapshot();
  });

  test('should render with dates - warning', () => {
    const { container } = render(
      <CullingInformation stale={staleDate} currDate={currdate} culled={cullDate} staleWarning={warningDate}>
        Some children
      </CullingInformation>,
    );
    expect(container).toMatchSnapshot();
  });

  test('should render with dates - danger', () => {
    const { container } = render(
      <CullingInformation stale={staleDate} currDate={currdate} culled={currdate} staleWarning={warningDate}>
        Some children
      </CullingInformation>,
    );
    expect(container).toMatchSnapshot();
  });

  test('should render with dates', () => {
    const { container } = render(
      <CullingInformation stale={staleDate} culled={cullDate} staleWarning={warningDate} currDate={new Date('Tue Jan 28 2020')}>
        Some children
      </CullingInformation>,
    );
    expect(container).toMatchSnapshot();
  });

  test('should render with dates - no tooltip', () => {
    const { container } = render(
      <CullingInformation stale={staleDate} culled={cullDate} staleWarning={warningDate} currDate={new Date('Tue Jan 21 2020')}>
        Some children
      </CullingInformation>,
    );
    expect(container).toMatchSnapshot();
  });
});
