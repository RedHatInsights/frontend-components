import React from 'react';

import { ReportDetails } from '..';
import report from '../../cypress/fixtures/report.json';

const ROOT = '.ins-c-report-details';
const HEADERS = ['Detected issues', 'Steps to resolve', 'Related Knowledgebase article', 'Additional info'];

const props = {
  report,
  kbaDetail: { view_uri: 'https://access.redhat.com/solutions/12345678', publishedTitle: 'Lorem ipsum article' },
  kbaLoading: false,
};

describe('report details: kba loaded', () => {
  beforeEach(() => {
    cy.mount(<ReportDetails {...props} />);
  });

  it('renders component and matches screenshot', () => {
    cy.get(ROOT).matchImage({
      maxDiffThreshold: 0.5,
    });
  });

  it('renders correct number of headers', () => {
    cy.get('.pf-v5-c-card__header').should('have.length', HEADERS.length);
    HEADERS.forEach((h) => cy.get('.pf-v5-c-card__header').contains(h).should('have.length', 1));
  });

  it('each header has an icon', () => {
    cy.get('.pf-v5-c-card__header > .ins-c-report-details__icon').should('have.length', HEADERS.length);
  });

  it('links have an icon', () => {
    // TODO: do not hardcode the value
    cy.get('a > [class="fas fa-external-link-alt"]').should('have.length', 3);
  });

  it('renders lists with ol, ul, and li tags', () => {
    // TODO: do not hardcode the value
    cy.get('ol ul > li').should('have.length', 3);
  });

  it('renders code blocks with pre and code tags', () => {
    // TODO: do not hardcode the value
    cy.get('pre code').should('have.length', 7);
  });

  it('renders table correctly', () => {
    const ths = report.rule.reason.match(/(?<=<th>)\S*\D*(?=<\/th>)/g);
    cy.get('table > tbody').within(() => {
      cy.get('tr').should('have.length', 2);
      // TODO: extract td data from the test data isntead of hardcoding it
      cy.get('tr > td').eq(0).should('contain', 'eth0');
      cy.get('tr > td').eq(1).should('contain', 'fe81::c547:c849:ee14:2bdc');
      cy.get('tr > th').should('have.length', ths.length);
      cy.get('tr > th').each(($th, index) => cy.wrap($th).should('contain', ths[index]));
    });
  });

  it('renders three dividers', () => {
    // TODO: make the assertion number dependant on input test data
    cy.get('hr[class=pf-v5-c-divider]').should('have.length', 3);
  });

  it('renders a loaded kba link', () => {
    cy.get(`${ROOT} .ins-c-report-details__kba .pf-v5-c-card__body`).find('.pf-v5-c-skeleton').should('have.length', 0);
    cy.get(`${ROOT} .ins-c-report-details__kba .pf-v5-c-card__body`)
      .contains(props.kbaDetail.publishedTitle)
      .invoke('attr', 'href')
      .should('eq', props.kbaDetail.view_uri);
  });
});

describe('report details: kba loading', () => {
  beforeEach(() => {
    mount(<ReportDetails {...{ ...props, kbaLoading: true }} />);
  });

  it('renders skeleton instead of a kba link', () => {
    cy.get(`${ROOT} .ins-c-report-details__kba .pf-v5-c-card__body`).find('.pf-v5-c-skeleton').should('have.length', 1);
  });
});
