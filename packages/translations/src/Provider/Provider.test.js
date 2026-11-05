import React from 'react';
import { render } from '@testing-library/react';
import { FormattedMessage } from 'react-intl';

import IntlProvider from './Provider';
describe('provider', () => {
  test('should render correctly', () => {
    const { container } = render(
      <IntlProvider>
        <div>Test</div>
      </IntlProvider>,
    );
    expect(container).toMatchSnapshot();
  });

  describe('messages', () => {
    test('no langauge', () => {
      const { container } = render(
        <IntlProvider messages={{ 'some.msg': 'Message' }}>
          <div>Test</div>
        </IntlProvider>,
      );
      expect(container).toMatchSnapshot();
    });

    describe('multiple Languages', () => {
      const translations = {
        en: {
          'some.msg': 'Message',
        },
        fr: {
          'some.msg': 'Message en français',
        },
      };

      test('no locale', () => {
        const { container } = render(
          <IntlProvider messages={translations}>
            <div>Test</div>
          </IntlProvider>,
        );
        expect(container).toMatchSnapshot();
      });

      test('fr-locale', () => {
        const { container } = render(
          <IntlProvider messages={translations} locale="fr">
            <FormattedMessage id="some.msg" />
          </IntlProvider>,
        );
        expect(container.textContent).toBe('Message en français');
      });
    });
  });
});
