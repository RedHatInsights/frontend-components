import { render } from '@testing-library/react'

import IntlProvider from './Provider';
describe('provider', () => {
  test('should render correctly', () => {
    const { container } = render(
      <IntlProvider>
        <div>Test</div>
      </IntlProvider>
    );
    expect(container).toMatchSnapshot();
  });

  describe('messages', () => {
    test('no langauge', () => {
      const { container } = render(
        <IntlProvider messages={{ 'some.msg': 'Message' }}>
          <div>Test</div>
        </IntlProvider>
      );
      expect(container).toMatchSnapshot();
    });

    describe('multiple Languages', () => {
      const translations = {
        en: {
          'some.msg': 'Message',
        },
        cs: {
          'some.msg': 'Zpráva',
        },
      };

      test('no locale', () => {
        const { container } = render(
          <IntlProvider messages={translations}>
            <div>Test</div>
          </IntlProvider>
        );
        expect(container).toMatchSnapshot();
      });

      test('cs-locale', () => {
        const { container } = render(
          <IntlProvider messages={translations} locale="cs">
            <div>Test</div>
          </IntlProvider>
        );
        expect(container).toMatchSnapshot();
      });
    });
  });
});
