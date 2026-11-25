import { createIntl, createIntlCache } from 'react-intl';
import impact from './impact';
import likelihood from './likelihood';
import category from './category';
import totalRisk from './totalRisk';
import riskOfChange from './riskOfChange';
import ansibleSupport from './ansibleSupport';
import ruleStatus from './ruleStatus';
import incidentRules from './incidentRules';
import description from './description';
import * as choices from '../RuleTable/constants';

const cases = [
  [impact, 'impact', 'Impact', choices.impact],
  [likelihood, 'likelihood', 'Likelihood', choices.impact],
  [category, 'category', 'Category', choices.category],
  [totalRisk, 'totalRisk', 'Total risk', choices.severity],
  [riskOfChange, 'riskOfChange', 'Risk of change', choices.riskOfChange],
  [ansibleSupport, 'ansibleSupport', 'Ansible support', choices.ansibleSupport],
  [ruleStatus, 'ruleStatus', 'Rule status', choices.ruleStatus],
  [incidentRules, 'incidentRules', 'Incident rules', choices.incidentRules],
];

describe('rule filter localization without changing filter contracts', () => {
  test.each(cases)('keeps English labels and machine values without Intl (case %#)', (factory, _kind, label, values) => {
    const result = factory();
    expect(result.label).toBe(label);
    expect(result.filterValues.items.map((item) => item.value).sort()).toEqual(Object.keys(values).sort());
    result.filterValues.items.forEach((item) => expect(item.textual).toBe(values[item.value]));
  });

  test.each(cases)('uses supplied Intl for labels but not values or callbacks (case %#)', (factory, kind, _label, values) => {
    const group = kind === 'likelihood' ? 'impact' : kind === 'totalRisk' ? 'severity' : kind;
    const messages = Object.fromEntries([
      [`ruleComponents.filters.${kind}.label`, `[fr] ${kind}`],
      ...Object.keys(values).map((key) => [`ruleComponents.filters.${group}.${key}`, `[fr] ${key}`]),
    ]);
    const intl = createIntl({ locale: 'fr', messages }, createIntlCache());
    const onChange = jest.fn();
    const value = ['unchanged-selection'];
    const result = factory({ intl, onChange, value });
    expect(result.label).toBe(`[fr] ${kind}`);
    expect(result.filterValues.onChange).toBe(onChange);
    expect(result.filterValues.value).toBe(value);
    expect(result.filterValues.items.map((item) => item.value).sort()).toEqual(Object.keys(values).sort());
    result.filterValues.items.forEach((item) => expect(item.textual).toBe(`[fr] ${item.value}`));
  });

  test('formats description accessibility copy while preserving input configuration', () => {
    const intl = createIntl({
      locale: 'fr',
      messages: {
        'ruleComponents.filters.description.label': '[fr] description',
        'ruleComponents.filters.description.input': '[fr] description input',
      },
    });
    const result = description({ intl, value: 'caller text' });
    expect(result.label).toBe('[fr] description');
    expect(result.filterValues['aria-label']).toBe('[fr] description input');
    expect(result.filterValues.value).toBe('caller text');
  });
});
