import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import InsightsLink from './InsightsLink';
import useChrome from '../useChrome';
jest.mock('../useChrome');

jest.mock('react-router-dom', () => ({
  Link: () => 'Mocked Link',
}));

describe('InsightsLink component', () => {
  describe('under /', () => {
    beforeEach(() => {
      useChrome.mockImplementation(() => ({
        isBeta: () => false,
        getApp: () => 'compliance',
        getBundle: () => 'insights',
      }));
    });

    it('should render a link with a given path', () => {
      const wrapper = mount(
        <InsightsLink to="/scappolicies">
          Link to Scap Policies under `/insights/compliance/...` will link to `/insights/compliance/scappolicies`
        </InsightsLink>
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render a link to /preview with a given path', () => {
      const wrapper = mount(<InsightsLink to="/scappolicies" preview />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render a link to a different app in preview when given', () => {
      const wrapper = mount(
        <InsightsLink to={'/ID_OF_A_SYSTEM'} app="inventory" preview>
          Link Inventory sytems page under `/insights/compliance/systems` will link to `/preview/insights/inventory/ID_OF_A_SYSTEM`
        </InsightsLink>
      );
      expect(toJson(wrapper)).toMatchSnapshot();
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
      const wrapper = mount(
        <InsightsLink to={'/ID_OF_A_SYSTEM'} app="inventory" preview={false}>
          Link Inventory sytems page under `/preview/insights/compliance/systems` will link to `/insights/inventory/ID_OF_A_SYSTEM`
        </InsightsLink>
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render a /preview link', () => {
      const wrapper = mount(
        <InsightsLink to={{ pathname: '/scappolicies' }}>
          Link to Scap Policies under `/preview/insights/compliance` will link to `/insights/compliance/scappolicies`
        </InsightsLink>
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
