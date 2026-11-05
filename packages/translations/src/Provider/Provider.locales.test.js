import React from 'react';
import { render } from '@testing-library/react';
import { FormattedMessage, useIntl } from 'react-intl';
import IntlProvider from './Provider';
import { translatedMessages } from '../translatedMessages/translatedMessages';

jest.mock('../generated/data.json', () => ({
  en: { 'default.save': 'Save', 'default.cancel': 'Cancel' },
  fr: { 'default.save': 'Enregistrer' },
  'zh-CN': { 'default.save': '保存' },
}));

const CurrentLocale = () => <span>{useIntl().locale}</span>;

const renderSave = (props = {}) =>
  render(
    <IntlProvider {...props}>
      <FormattedMessage id="default.save" />
    </IntlProvider>,
  );

describe('provider locale resolution', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(navigator, 'language', 'get').mockReturnValue('en-US');
  });

  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test.each(['zh-CN', 'zh-cn', 'zh_CN'])('loads exact Chinese catalog for browser locale %s', (locale) => {
    jest.spyOn(navigator, 'language', 'get').mockReturnValue(locale);
    expect(renderSave().container.textContent).toBe('保存');
  });

  test('uses base catalog without discarding regional formatting locale', () => {
    jest.spyOn(navigator, 'language', 'get').mockReturnValue('fr-CA');
    const { container } = render(
      <IntlProvider>
        <FormattedMessage id="default.save" />
        <CurrentLocale />
      </IntlProvider>,
    );
    expect(container.textContent).toBe('Enregistrerfr-CA');
  });

  test('explicit locale overrides storage and browser', () => {
    localStorage.setItem('rhcs-language', 'fr');
    expect(renderSave({ locale: 'zh-CN' }).container.textContent).toBe('保存');
  });

  test('stored locale overrides browser', () => {
    localStorage.setItem('rhcs-language', 'zh-CN');
    expect(renderSave().container.textContent).toBe('保存');
  });

  test('falls back to bundled English when locale is unavailable', () => {
    expect(renderSave({ locale: 'de' }).container.textContent).toBe('Save');
  });

  test('falls back to English for messages missing from a delivered catalog', () => {
    const { container } = render(
      <IntlProvider locale="fr">
        <FormattedMessage id="default.cancel" />
      </IntlProvider>,
    );
    expect(container.textContent).toBe('Cancel');
  });

  test('exact caller catalog overrides bundled messages', () => {
    expect(
      renderSave({ locale: 'fr-CA', messages: { fr: { 'default.save': 'base' }, 'fr-CA': { 'default.save': 'exact' } } }).container.textContent,
    ).toBe('exact');
  });

  test('accepts caller catalogs by base locale', () => {
    expect(renderSave({ locale: 'fr-CA', messages: { fr: { 'default.save': 'caller' } } }).container.textContent).toBe('caller');
  });

  test('accepts flat caller messages', () => {
    expect(renderSave({ locale: 'fr', messages: { 'default.save': 'caller' } }).container.textContent).toBe('caller');
  });

  test.each([
    ['fr', 'Français'],
    ['fr-CA', 'Français'],
    ['FR', 'Français'],
    ['fr', [{ type: 0, value: 'Français' }]],
    ['fr-CA', [{ type: 0, value: 'Français' }]],
  ])('preserves flat messages when %s is a message ID with value %j', (id, value) => {
    expect(renderSave({ locale: 'fr-CA', messages: { [id]: value, 'default.save': 'caller' } }).container.textContent).toBe('caller');
  });

  test('exports the same bundled catalogs used by the provider', () => {
    expect(renderSave({ locale: 'zh-CN' }).container.textContent).toBe(translatedMessages['zh-CN']['default.save']);
  });
});
