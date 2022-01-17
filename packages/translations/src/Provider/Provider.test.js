import React from 'react';
import IntlProvider from './Provider';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
describe('provider', () => {
  test('should render correctly', () => {
    const wrapper = mount(
      <IntlProvider>
        <div>Test</div>
      </IntlProvider>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  describe('messages', () => {
    test('no langauge', () => {
      const wrapper = mount(
        <IntlProvider messages={{ 'some.msg': 'Message' }}>
          <div>Test</div>
        </IntlProvider>
      );
      expect(toJson(wrapper)).toMatchSnapshot();
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
        const wrapper = mount(
          <IntlProvider messages={translations}>
            <div>Test</div>
          </IntlProvider>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
      });

      test('cs-locale', () => {
        const wrapper = mount(
          <IntlProvider messages={translations} locale="cs">
            <div>Test</div>
          </IntlProvider>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });
  });
});
