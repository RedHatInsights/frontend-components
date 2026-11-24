import React from 'react';
import { act, render } from '@testing-library/react';

import IntlProvider from './Provider';
describe('provider', () => {
  test('should render correctly', async () => {
    const { container } = render(
      <IntlProvider>
        <div>Test</div>
      </IntlProvider>,
    );
    await act(async () => {});
    expect(container).toMatchSnapshot();
  });

  describe('messages', () => {
    test('no langauge', async () => {
      const { container } = render(
        <IntlProvider messages={{ 'some.msg': 'Message' }}>
          <div>Test</div>
        </IntlProvider>,
      );
      await act(async () => {});
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

      test('no locale', async () => {
        const { container } = render(
          <IntlProvider messages={translations}>
            <div>Test</div>
          </IntlProvider>,
        );
        await act(async () => {});
        expect(container).toMatchSnapshot();
      });
    });
  });
});
