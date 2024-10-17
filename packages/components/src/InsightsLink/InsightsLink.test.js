import React from 'react';
import InsightsLink from './InsightsLink';
import useChrome from '../useChrome';
import { render } from '@testing-library/react';

jest.mock('../useChrome', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    isBeta: () => false,
    getApp: () => 'compliance',
    getBundle: () => 'insights',
  })),
}));
jest.mock('react-router-dom', () => ({
  Link: () => 'Mocked Link',
}));

describe('InsightsLink component', () => {
  describe('under /', () => {
    it('should render a link with a given path', () => {
      const { container } = render(
        <InsightsLink to="/scappolicies">
          Link to Scap Policies under `/insights/compliance/...` will link to `/insights/compliance/scappolicies`
        </InsightsLink>
      );
      expect(container).toMatchSnapshot();
    });

    it('should render a link to /preview with a given path', () => {
      const { container } = render(<InsightsLink to="/scappolicies" preview />);
      expect(container).toMatchSnapshot();
    });

    it('should render a link to a different app in preview when given', () => {
      const { container } = render(
        <InsightsLink to={'/ID_OF_A_SYSTEM'} app="inventory" preview>
          Link Inventory sytems page under `/insights/compliance/systems` will link to `/preview/insights/inventory/ID_OF_A_SYSTEM`
        </InsightsLink>
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('under /preview', () => {
    beforeEach(() => {
      useChrome.mockImplementation(() => ({
        isBeta: () => true,
        getApp: () => 'compliance',
        getBundle: () => 'insights',
      }));
    });

    it('should render a link to non /preview', () => {
      const { container } = render(
        <InsightsLink to={'/ID_OF_A_SYSTEM'} app="inventory" preview={false}>
          Link Inventory sytems page under `/preview/insights/compliance/systems` will link to `/insights/inventory/ID_OF_A_SYSTEM`
        </InsightsLink>
      );
      expect(container).toMatchSnapshot();
    });

    it('should render a /preview link', () => {
      const { container } = render(
        <InsightsLink to={{ pathname: '/scappolicies' }}>
          Link to Scap Policies under `/preview/insights/compliance` will link to `/insights/compliance/scappolicies`
        </InsightsLink>
      );
      expect(container).toMatchSnapshot();
    });
  });
});
