import { buildInsightsPath } from './urlPathHelpers';

describe('buildInsightsPath', () => {
  const fakeChrome = {
    isBeta: jest.fn(() => false),
    getBundle: jest.fn(() => 'insights'),
    getApp: jest.fn(() => 'compliance'),
  };

  it('should return a path', () => {
    expect(buildInsightsPath(fakeChrome, 'compliance', '/scappolicies')).toEqual('/insights/compliance/scappolicies');
  });

  it('should return a path', () => {
    expect(buildInsightsPath(fakeChrome, 'inventory', '/ID')).toEqual('/insights/inventory/ID');
  });

  it('should return a path', () => {
    fakeChrome.getBundle.mockImplementation(() => 'openshift/insights');
    expect(buildInsightsPath(fakeChrome, 'advisor', '/ID')).toEqual('/openshift/insights/advisor/ID');
  });

  describe('under /preview', () => {
    const fakeChrome = {
      isBeta: jest.fn(() => true),
      getBundle: jest.fn(() => 'insights'),
      getApp: jest.fn(() => 'compliance'),
    };

    it('should return a preview path when isBeta is true', () => {
      expect(buildInsightsPath(fakeChrome, 'compliance', '/scappolicies')).toEqual('/insights/compliance/scappolicies');
    });

    it('should return a non preview path when isBeta is true, force preview is false', () => {
      expect(buildInsightsPath(fakeChrome, 'compliance', '/scappolicies', false)).toEqual('/insights/compliance/scappolicies');
    });
  });
});
