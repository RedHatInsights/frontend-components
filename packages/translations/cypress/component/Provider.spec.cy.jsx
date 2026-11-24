import { act, useState } from 'react';
import { mount } from 'cypress/react18';
import { FormattedMessage, useIntl } from 'react-intl';
import IntlProvider from '../../src/Provider/Provider';
import { setLoader } from '../fixtures/loadMessages';

const catalogs = { fr: { 'default.save': 'Enregistrer', 'test.delivered': 'loaded' }, 'zh-CN': { 'default.save': '保存' } };
const deliver = async (locale) => {
  const [canonical] = Intl.getCanonicalLocales(locale);
  return catalogs[canonical] ?? catalogs[canonical.split('-')[0]];
};
const deferred = () => {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
};
// A resolved loader promise is not proof that React committed its state update.
const settle = (pending, catalog) =>
  cy.then(() =>
    act(async () => {
      pending.resolve(catalog);
      await pending.promise;
    }),
  );
const CurrentIntl = () => {
  const intl = useIntl();
  return (
    <>
      <span data-testid="locale">{intl.locale}</span>
      <pre data-testid="messages">{JSON.stringify(intl.messages)}</pre>
    </>
  );
};
const Save = () => (
  <>
    <span data-testid="save">
      <FormattedMessage id="default.save" />
    </span>
    <CurrentIntl />
  </>
);
const mountSave = (props = {}) =>
  mount(
    <IntlProvider {...props}>
      <Save />
    </IntlProvider>,
  );
const expectSave = (text) => cy.get('[data-testid="save"]').should('have.text', text);
const Switcher = () => {
  const [locale, setLocale] = useState('fr');
  return (
    <>
      <button onClick={() => setLocale('zh-CN')}>Switch locale</button>
      <IntlProvider locale={locale}>
        <Save />
      </IntlProvider>
    </>
  );
};

describe('provider locale resolution', () => {
  let loader;
  beforeEach(() => {
    localStorage.clear();
    cy.stub(navigator, 'language').value('en-US');
    loader = cy.stub().callsFake(deliver).as('loadMessages');
    setLoader(loader);
  });
  afterEach(() => localStorage.clear());

  ['zh-CN', 'zh-cn', 'zh_CN'].forEach((locale) => {
    it(`loads one catalog for browser locale ${locale}`, () => {
      cy.stub(navigator, 'language').value(locale);
      mountSave();
      expectSave('保存');
      cy.get('@loadMessages').should('have.been.calledOnceWithExactly', locale.replace('_', '-'));
    });
  });
  it('uses base catalog without discarding regional formatting locale', () => {
    cy.stub(navigator, 'language').value('fr-CA');
    mountSave();
    expectSave('Enregistrer');
    cy.get('[data-testid="locale"]').should('have.text', 'fr-CA');
  });
  it('explicit locale overrides storage and browser', () => {
    localStorage.setItem('rhcs-language', 'fr');
    mountSave({ locale: 'zh-CN' });
    expectSave('保存');
    cy.get('@loadMessages').should('have.been.calledOnceWithExactly', 'zh-CN');
  });
  it('stored locale overrides browser', () => {
    localStorage.setItem('rhcs-language', 'zh-CN');
    mountSave();
    expectSave('保存');
  });
  it('falls back to English for a locale without delivery', () => {
    const pending = deferred();
    loader.returns(pending.promise);
    mountSave({ locale: 'de' });
    cy.get('@loadMessages').should('have.been.calledOnceWithExactly', 'de');
    settle(pending, undefined);
    expectSave('Save');
  });
  ['en-US', 'en-GB', 'en'].forEach((locale) => {
    it(`renders ${locale} defaults without missing-translation errors`, () => {
      const onError = cy.stub().as('onError');
      mount(
        <IntlProvider locale={locale} onError={onError}>
          <FormattedMessage id="test.default" defaultMessage="{count, plural, one {# item} other {# items}}" values={{ count: 2 }} />
        </IntlProvider>,
      );
      cy.contains('2 items').should('be.visible');
      cy.get('@onError').should('not.have.been.called');
    });
  });
  it('shows English while pending, then updates on catalog arrival', () => {
    const pending = deferred();
    loader.returns(pending.promise);
    mountSave({ locale: 'fr' });
    expectSave('Save');
    settle(pending, catalogs.fr);
    expectSave('Enregistrer');
  });
  it('retains English after an undelivered result', () => {
    const pending = deferred();
    loader.returns(pending.promise);
    mountSave({ locale: 'fr' });
    cy.get('@loadMessages').should('have.been.calledOnce');
    settle(pending, undefined);
    expectSave('Save');
  });
  it('ignores an obsolete request after switching locales', () => {
    const pending = deferred();
    loader.onFirstCall().returns(pending.promise);
    mount(<Switcher />);
    cy.contains('button', 'Switch locale').click();
    expectSave('保存');
    settle(pending, catalogs.fr);
    expectSave('保存');
    cy.get('[data-testid="locale"]').should('have.text', 'zh-CN');
  });
  it('does not display old catalog under a newly selected locale while pending', () => {
    const pending = deferred();
    loader.onSecondCall().returns(pending.promise);
    mount(<Switcher />);
    expectSave('Enregistrer');
    cy.contains('button', 'Switch locale').click();
    expectSave('Save');
    cy.get('[data-testid="locale"]').should('have.text', 'zh-CN');
    settle(pending, catalogs['zh-CN']);
    expectSave('保存');
  });
  it('retains legacy English defaults missing from delivered catalog', () => {
    const pending = deferred();
    loader.returns(pending.promise);
    mount(
      <IntlProvider locale="fr">
        <span data-testid="cancel">
          <FormattedMessage id="default.cancel" />
        </span>
        <CurrentIntl />
      </IntlProvider>,
    );
    settle(pending, catalogs.fr);
    cy.get('[data-testid="messages"]').should('contain.text', 'test.delivered');
    cy.get('[data-testid="cancel"]').should('have.text', 'Cancel');
  });
  [
    [undefined, '0 items'],
    [{ 'test.count': '{count, plural, one {# élément} other {# éléments}}' }, '0 élément'],
  ].forEach(([catalog, expected]) => {
    it(`uses the correct plural rules: ${expected}`, () => {
      const pending = deferred();
      loader.returns(pending.promise);
      mount(
        <IntlProvider locale="fr" onError={() => {}}>
          <span data-testid="count">
            <FormattedMessage id="test.count" defaultMessage="{count, plural, one {# item} other {# items}}" values={{ count: 0 }} />
          </span>
        </IntlProvider>,
      );
      settle(pending, catalog);
      cy.get('[data-testid="count"]').should('have.text', expected);
    });
  });
  [
    [{ fr: { 'default.save': 'base' }, 'fr-CA': { 'default.save': 'exact' } }, 'exact'],
    [{ fr: { 'default.save': 'caller' } }, 'caller'],
    [{ 'default.save': 'caller' }, 'caller'],
  ].forEach(([messages, expected], index) => {
    it(`preserves caller override ${index} before and after delivery`, () => {
      const pending = deferred();
      loader.returns(pending.promise);
      mountSave({ locale: 'fr-CA', messages });
      expectSave(expected);
      settle(pending, catalogs.fr);
      cy.get('[data-testid="messages"]').should(($messages) => {
        expect(JSON.parse($messages.text())).to.have.property('test.delivered', 'loaded');
      });
      expectSave(expected);
      cy.get('@loadMessages').should('have.been.calledOnce');
    });
  });
  it('does not leak unmatched caller locale catalogs into message IDs', () => {
    const pending = deferred();
    loader.returns(pending.promise);
    mountSave({ locale: 'fr', messages: { en: { 'default.save': 'English override' } } });
    const expectNoEnglishCatalog = () =>
      cy
        .get('[data-testid="messages"]')
        .invoke('text')
        .then((text) => {
          expect(JSON.parse(text)).not.to.have.property('en');
        });
    expectSave('Save');
    expectNoEnglishCatalog();
    settle(pending, catalogs.fr);
    expectSave('Enregistrer');
    expectNoEnglishCatalog();
  });
});
