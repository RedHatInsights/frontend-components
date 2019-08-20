import React from 'react';
import IntlProvider, { updateLocaleData } from './Provider';
import { mount } from 'enzyme';
import { LOCALSTORAGE_KEY } from './';
import toJson from 'enzyme-to-json';

describe('updateLocaleData', () => {
    test('en should be present', () => {
        expect(updateLocaleData()[0].locale).toBe('en');
    });
    test('it should update locale', () => {
        const newLocaleData = updateLocaleData([{ locale: 'test' }]);
        expect(newLocaleData[newLocaleData.length - 1].locale).toBe('test');
    });
});

describe('provider', () => {
    test('should render correctly', () => {
        const wrapper = mount(<IntlProvider><div>Test</div></IntlProvider>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('messages', () => {
        test('no langauge', () => {
            const wrapper = mount(<IntlProvider messages={ { 'some.msg': 'Message' } }><div>Test</div></IntlProvider>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        describe('multiple Languages', () => {
            const translations = {
                en: {
                    'some.msg': 'Message'
                },
                cs: {
                    'some.msg': 'Zpráva'
                }
            };

            test('no locale', () => {
                const wrapper = mount(<IntlProvider messages={ translations }><div>Test</div></IntlProvider>);
                expect(toJson(wrapper)).toMatchSnapshot();
            });

            test('cs-locale', () => {
                const wrapper = mount(<IntlProvider messages={ translations } locale="cs"><div>Test</div></IntlProvider>);
                expect(toJson(wrapper)).toMatchSnapshot();
            });
        });
    });
});
