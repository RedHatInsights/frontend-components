import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { FormattedMessage, useIntl } from 'react-intl';
import IntlProvider from './Provider';
import { messageCatalogs } from '../messageCatalogs';

jest.mock('../messageCatalogs', () => ({ messageCatalogs: { en: jest.fn(), fr: jest.fn(), 'zh-CN': jest.fn() } }));

const CurrentLocale = () => <span>{useIntl().locale}</span>;
const renderSave = (props = {}) =>
  render(
    <IntlProvider {...props}>
      <FormattedMessage id="default.save" />
    </IntlProvider>,
  );
const settle = () => act(async () => {});
const deferred = () => {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
};

describe('provider locale resolution', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(navigator, 'language', 'get').mockReturnValue('en-US');
    messageCatalogs.en.mockReset().mockResolvedValue({ default: { 'default.save': 'Save' } });
    messageCatalogs.fr.mockReset().mockResolvedValue({ default: { 'default.save': 'Enregistrer' } });
    messageCatalogs['zh-CN'].mockReset().mockResolvedValue({ default: { 'default.save': '保存' } });
  });
  afterEach(async () => {
    await settle();
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test.each(['zh-CN', 'zh-cn', 'zh_CN'])('loads only exact Chinese catalog for browser locale %s', async (locale) => {
    jest.spyOn(navigator, 'language', 'get').mockReturnValue(locale);
    const { container } = renderSave();
    await waitFor(() => expect(container.textContent).toBe('保存'));
    expect(messageCatalogs['zh-CN']).toHaveBeenCalledTimes(1);
    expect(messageCatalogs.en).not.toHaveBeenCalled();
    expect(messageCatalogs.fr).not.toHaveBeenCalled();
  });
  test('uses base catalog without discarding regional formatting locale', async () => {
    jest.spyOn(navigator, 'language', 'get').mockReturnValue('fr-CA');
    const { container } = render(
      <IntlProvider>
        <FormattedMessage id="default.save" />
        <CurrentLocale />
      </IntlProvider>,
    );
    await waitFor(() => expect(container.textContent).toBe('Enregistrerfr-CA'));
  });
  test('explicit locale overrides storage and browser', async () => {
    localStorage.setItem('rhcs-language', 'fr');
    const { container } = renderSave({ locale: 'zh-CN' });
    await waitFor(() => expect(container.textContent).toBe('保存'));
    expect(messageCatalogs.fr).not.toHaveBeenCalled();
  });
  test('stored locale overrides browser', async () => {
    localStorage.setItem('rhcs-language', 'zh-CN');
    const { container } = renderSave();
    await waitFor(() => expect(container.textContent).toBe('保存'));
  });
  test('falls back to English without requesting an unsupported locale', () => {
    expect(renderSave({ locale: 'de' }).container.textContent).toBe('Save');
    for (const loader of Object.values(messageCatalogs)) expect(loader).not.toHaveBeenCalled();
  });
  test.each(['en-US', 'en-GB', 'en'])('renders %s source defaults without reporting missing translations', async (locale) => {
    jest.spyOn(navigator, 'language', 'get').mockReturnValue(locale);
    const onError = jest.fn();
    const { container } = render(
      <IntlProvider onError={onError}>
        <FormattedMessage id="test.libraryDefault" defaultMessage="{count, plural, one {# item} other {# items}}" values={{ count: 2 }} />
        <CurrentLocale />
      </IntlProvider>,
    );
    await settle();
    expect(container.textContent).toBe(`2 items${locale}`);
    expect(onError).not.toHaveBeenCalled();
  });
  test('shows English immediately while selected catalog loads', async () => {
    const pending = deferred();
    messageCatalogs.fr.mockReturnValue(pending.promise);
    const { container } = renderSave({ locale: 'fr' });
    expect(container.textContent).toBe('Save');
    await act(async () => pending.resolve({ default: { 'default.save': 'Enregistrer' } }));
    expect(container.textContent).toBe('Enregistrer');
  });
  test('falls back to English if a delivery is absent or fails to load', async () => {
    messageCatalogs.fr.mockRejectedValue(new Error('missing locale chunk'));
    const { container } = renderSave({ locale: 'fr' });
    await settle();
    expect(messageCatalogs.fr).toHaveBeenCalledTimes(1);
    expect(container.textContent).toBe('Save');
  });
  test('ignores an obsolete request after switching locales', async () => {
    const pending = deferred();
    messageCatalogs.fr.mockReturnValue(pending.promise);
    const { container, rerender } = renderSave({ locale: 'fr' });
    rerender(
      <IntlProvider locale="zh-CN">
        <FormattedMessage id="default.save" />
        <CurrentLocale />
      </IntlProvider>,
    );
    await waitFor(() => expect(container.textContent).toBe('保存zh-CN'));
    await act(async () => pending.resolve({ default: { 'default.save': 'Enregistrer' } }));
    expect(container.textContent).toBe('保存zh-CN');
  });
  test('does not display old catalog under newly selected locale while loading', async () => {
    const { container, rerender } = renderSave({ locale: 'fr' });
    await waitFor(() => expect(container.textContent).toBe('Enregistrer'));
    const pending = deferred();
    messageCatalogs['zh-CN'].mockReturnValue(pending.promise);
    rerender(
      <IntlProvider locale="zh-CN">
        <FormattedMessage id="default.save" />
        <CurrentLocale />
      </IntlProvider>,
    );
    expect(container.textContent).toBe('Savezh-CN');
    await act(async () => pending.resolve({ default: { 'default.save': '保存' } }));
    expect(container.textContent).toBe('保存zh-CN');
  });
  test('falls back to English for messages missing from a delivered catalog', async () => {
    const { container } = render(
      <IntlProvider locale="fr">
        <FormattedMessage id="default.cancel" />
      </IntlProvider>,
    );
    await settle();
    expect(container.textContent).toBe('Cancel');
  });
  test('uses English plural rules for a descriptor missing from selected catalog', async () => {
    const { container } = render(
      <IntlProvider locale="fr" onError={() => {}}>
        <FormattedMessage id="test.resultCount" defaultMessage="{count, plural, one {# item} other {# items}}" values={{ count: 0 }} />
      </IntlProvider>,
    );
    await settle();
    expect(container.textContent).toBe('0 items');
  });
  test('uses target-locale plural rules for a delivered message', async () => {
    messageCatalogs.fr.mockResolvedValue({ default: { 'test.resultCount': '{count, plural, one {# élément} other {# éléments}}' } });
    const { container } = render(
      <IntlProvider locale="fr" onError={() => {}}>
        <FormattedMessage id="test.resultCount" defaultMessage="{count, plural, one {# item} other {# items}}" values={{ count: 0 }} />
      </IntlProvider>,
    );
    await waitFor(() => expect(container.textContent).toBe('0 élément'));
  });
  test.each([
    [{ fr: { 'default.save': 'base' }, 'fr-CA': { 'default.save': 'exact' } }, 'exact'],
    [{ fr: { 'default.save': 'caller' } }, 'caller'],
    [{ 'default.save': 'caller' }, 'caller'],
    ...['fr', 'fr-CA', 'FR'].map((id) => [{ [id]: 'Français', 'default.save': 'caller' }, 'caller']),
    ...['fr', 'fr-CA'].map((id) => [{ [id]: [{ type: 0, value: 'Français' }], 'default.save': 'caller' }, 'caller']),
  ])('preserves caller override %j before and after loading', async (messages, expected) => {
    const { container } = renderSave({ locale: 'fr-CA', messages });
    expect(container.textContent).toBe(expected);
    await settle();
    expect(messageCatalogs.fr).toHaveBeenCalledTimes(1);
    expect(container.textContent).toBe(expected);
  });
});
