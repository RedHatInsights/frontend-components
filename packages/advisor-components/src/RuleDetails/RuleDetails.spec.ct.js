import React from 'react';

import rule from '../../cypress/fixtures/rule.json';
import messages from '../../cypress/fixtures/messages.json';
import { AdvisorProduct } from '../types';
import { RuleDetails } from '..';

const fixtures = {
  messages,
  product: AdvisorProduct.ocp,
  header: 'Test header',
  rule: rule,
  isDetailsPage: true,
  onVoteClick: () => undefined,
  resolutionRisk: 1,
  resolutionRiskDesc: 'Risk of change description',
};

// TODO: Implement selectors using OUIA attributes https://ouia.readthedocs.io/en/latest/README.html

// TODO: Add tests for the RHEL context

describe('RuleDetails: details page', () => {
  const ROOT = '.ins-c-rule-details';

  beforeEach(() => {
    cy.mount(<RuleDetails {...fixtures} />);
  });

  it('renders component', () => {
    cy.get(ROOT);
  });

  it('renders custom header', () => {
    cy.get('.ins-c-rule-details__header').should('have.text', 'Test header');
  });

  it('renders description', () => {
    cy.get('.ins-c-rule-details__description').should('have.text', rule.description);
  });

  it('does not render view affected button', () => {
    cy.get(ROOT).find('.ins-c-rule-details__view-affected').should('have.length', 0);
  });

  it('renders correct total risk block', () => {
    cy.get('.ins-c-rule-details__total-risk').should('have.text', 'Moderate');
    cy.get('.ins-c-rule-details__total-risk-body').should(
      'have.text',
      'The total risk of this remediation is low, based on the combination of likelihood and impact to remediate.'
    );
  });

  it('renders correct rule upvote', () => {
    cy.get('.ins-c-rule-details__vote').find('.ins-c-like').should('have.length', 1);
    cy.get('.ins-c-rule-details__vote').find('.ins-c-dislike').should('have.length', 0);
  });

  it('renders two severity lines', () => {
    cy.get(ROOT).find('.ins-c-severity-line').should('have.length', 2);
  });

  it('on vote callback fired', () => {
    const onVoteClick = () => fetch('https://foo.bar/rating');
    cy.intercept('https://foo.bar/rating', 'ok').as('voteRequest');

    cy.mount(<RuleDetails {...fixtures} onVoteClick={onVoteClick} />);
    cy.get('.ins-c-rule-details__vote').find('[data-ouia-component-id="thumbsDown"]').click();
    cy.wait('@voteRequest');
  });
});
