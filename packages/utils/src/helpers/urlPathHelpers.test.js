import { buildInsightsPath } from './urlPathHelpers';

const fakeChrome = {
  isBeta: jest.fn(() => false),
  getBundle: jest.fn(() => 'insights'),
  getApp: jest.fn(() => 'compliance'),
};

describe('buildInsightsPath', () => {
  it('should return a path', () => {
    expect(buildInsightsPath(fakeChrome, 'compliance', '/scappolicies')).toEqual('/insights/compliance/scappolicies');
  });

  it('should return a preview path when isBeta is true', () => {
    fakeChrome.isBeta.mockImplementation(() => true);
    expect(buildInsightsPath(fakeChrome, 'compliance', '/scappolicies')).toEqual('/preview/insights/compliance/scappolicies');
  });
});
