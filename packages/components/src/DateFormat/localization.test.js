import { createIntl, createIntlCache } from 'react-intl';
import { dateStringByType } from './helper';
import { calculateTooltip } from '../CullingInfo/utils';

const intl = createIntl(
  {
    locale: 'fr',
    messages: {
      'components.dateFormat.justNow': '[fr] now',
      'components.dateFormat.invalidDate': '[fr] invalid',
      'components.cullingInfo.removalScheduled': '[fr] removal in {count, number} days',
    },
  },
  createIntlCache(),
);

describe('locale-aware non-hook date helpers', () => {
  const now = new Date('2019-12-31T00:00:00Z');
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(now);
  });
  afterEach(() => jest.useRealTimers());

  test('keeps provider-free English and UTC layout', () => {
    expect(dateStringByType('exact')(now)).toBe('31 Dec 2019 00:00 UTC');
    expect(dateStringByType('onlyDate')(now)).toBe('31 Dec 2019');
    expect(dateStringByType('relative')(new Date('2019-12-30T23:50:00Z'))).toBe('10 minutes ago');
    expect(dateStringByType('invalid')(now)).toBe('Invalid date');
  });

  test('uses selected locale for relative dates and translated default labels', () => {
    expect(dateStringByType('relative', intl)(new Date('2019-12-30T23:50:00Z'))).toBe('il y a 10 minutes');
    expect(dateStringByType('relative', intl)(new Date('2019-12-30T23:59:50Z'))).toBe('[fr] now');
    expect(dateStringByType('invalid', intl)(now)).toBe('[fr] invalid');
  });

  test('localizes dates without changing the UTC date boundary', () => {
    expect(dateStringByType('onlyDate', intl)(now)).toBe('31 déc. 2019');
  });

  test('keeps culling calculations and English string API; accepts the rendering component locale', () => {
    const culled = '2020-01-02T00:00:00Z';
    const warning = '2019-12-30T00:00:00Z';
    expect(calculateTooltip(culled, warning, now)).toEqual({ isError: true, msg: 'System scheduled for inventory removal in 2 days' });
    expect(calculateTooltip(culled, warning, now, intl)).toEqual({ isError: true, msg: '[fr] removal in 2 days' });
  });
});
