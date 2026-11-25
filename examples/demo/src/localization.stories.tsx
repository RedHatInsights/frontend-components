import IntlProvider from '@redhat-cloud-services/frontend-components-translations/Provider';
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, within } from 'storybook/test';

import RuleFeedback from '@redhat-cloud-services/rule-components/ReportDetails/RuleFeedback';
import RuleRating from '@redhat-cloud-services/frontend-components-advisor-components/RuleRating/RuleRating';
import type { RuleDetailsMessages } from '@redhat-cloud-services/frontend-components-advisor-components/RuleDetails/RuleDetailsMessages';
import NotificationPagination from '@redhat-cloud-services/frontend-components-notifications/NotificationPagination/NotificationPagination';
import parseCvssScore from '@redhat-cloud-services/frontend-components-utilities/parseCvssScore/parseCvssScore';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner/Spinner';
import Reboot from '@redhat-cloud-services/frontend-components/Reboot/Reboot';
import Shield from '@redhat-cloud-services/frontend-components/Shield/Shield';
import TableToolbar from '@redhat-cloud-services/frontend-components/TableToolbar/TableToolbar';
import DefaultErrorMessage from '@redhat-cloud-services/frontend-components/ErrorState/DefaultErrorMessage';
import { syntheticCatalog } from '../../../packages/components/cypress/fixtures/localization';

const meta = { title: 'Components/Localization' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const callerMessages: RuleDetailsMessages = {
  systemReboot: '',
  knowledgebaseArticle: '',
  totalRisk: '',
  rulesDetailsTotalRiskBody: '',
  likelihoodLevel: '',
  likelihoodDescription: '',
  impactLevel: '',
  impactDescription: '',
  riskOfChange: '',
  riskOfChangeText: '',
  riskOfChangeLabel: '',
  ruleHelpful: 'Caller question',
  feedbackThankYou: 'Caller thanks',
};

export const WithoutProvider: Story = {
  render: () => (
    <>
      <Spinner />
      <Reboot />
      <DefaultErrorMessage />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading...');
    await expect(canvas.getByText('Reboot required')).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Red Hat Support' })).toHaveAttribute('href', 'https://access.redhat.com/support');
  },
};

export const TranslatedDefaults: Story = {
  render: () => (
    <IntlProvider locale="fr" messages={syntheticCatalog('fr')}>
      <Spinner />
      <Reboot />
      <Shield impact={3} hasLabel hasTooltip={false} />
      <NotificationPagination />
      <RuleFeedback ruleId="fixture" userVote={0} onFeedbackChanged={() => {}} />
      <RuleRating ruleId="fixture" ruleRating={0} onVoteClick={() => {}} messages={callerMessages} />
      <div data-testid="cvss">{parseCvssScore()}</div>
      <DefaultErrorMessage />
    </IntlProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('[fr:components.spinner.loadingText]');
    await expect(canvas.getByText(/^\[fr:components.reboot.text\]/)).toBeVisible();
    await expect(canvas.getByLabelText(/^\[fr:components.severity.high\]/)).toBeVisible();
    await expect(canvas.getByRole('button', { name: /^\[fr:notifications.notificationPagination.clearAll\]/ })).toBeVisible();
    await expect(canvas.getByRole('button', { name: /^\[fr:advisorComponents.ruleRating.thumbsUp\]/ })).toBeVisible();
    await expect(canvas.getByTestId('cvss')).toHaveTextContent('[fr:utils.parseCvssScore.nA]');
    await expect(canvas.getByText('Caller question')).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Red Hat Support' })).toHaveAttribute('href', 'https://access.redhat.com/support');
    await userEvent.click(canvas.getByRole('button', { name: /^\[fr:ruleComponents.ruleFeedback.helpful\]/ }));
    await expect(canvas.getByText(/^\[fr:ruleComponents.ruleFeedback.thanks\]/)).toBeVisible();
  },
};

const LocaleSwitcher = () => {
  const [locale, setLocale] = useState('fr');
  const [count, setCount] = useState(2);
  return (
    <>
      <button onClick={() => setLocale('de')}>Switch locale</button>
      <button onClick={() => setCount(0)}>Show zero</button>
      <IntlProvider locale={locale} messages={syntheticCatalog(locale)}>
        <Reboot />
        <TableToolbar results={count} />
      </IntlProvider>
    </>
  );
};

export const LocaleAndPluralChanges: Story = {
  render: () => <LocaleSwitcher />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/^\[fr:components.tableToolbar.resultCount\]/)).toHaveTextContent('2 Results');
    await userEvent.click(canvas.getByRole('button', { name: 'Show zero' }));
    await expect(canvas.getByText(/^\[fr:components.tableToolbar.resultCount\]/)).toHaveTextContent('0 Result');
    await userEvent.click(canvas.getByRole('button', { name: 'Switch locale' }));
    await expect(canvas.getByText(/^\[de:components.reboot.text\]/)).toBeVisible();
    await expect(canvas.getByText(/^\[de:components.tableToolbar.resultCount\]/)).toHaveTextContent('0 Results');
  },
};

export const CallerOverrides: Story = {
  render: () => (
    <IntlProvider locale="fr" messages={syntheticCatalog('fr')}>
      <Spinner loadingText="Caller loading" />
      <Reboot text={<strong>Caller reboot</strong>} />
      <Reboot text="" />
      <Reboot text={null} />
    </IntlProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('Caller loading');
    await expect(canvas.getByText('Caller reboot').tagName).toBe('STRONG');
    await expect(canvas.queryByText(/\[fr:/)).not.toBeInTheDocument();
    await expect([...canvasElement.querySelectorAll('.ins-c-reboot')].map((element) => element.textContent)).toEqual(['Caller reboot', '', '']);
  },
};
