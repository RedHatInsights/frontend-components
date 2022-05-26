import React from 'react';
import { mount } from '@cypress/react';

import { ReportDetails } from '..';
import report from '../../cypress/fixtures/report.json';

const ROOT = '.ins-c-report-details';
const HEADERS = ['Detected issues', 'Steps to resolve', 'Related Knowledgebase article', 'Additional info'];

describe('report details: kba loaded', () => {
  beforeEach(() => {
    mount(
      <ReportDetails
        report={report}
        kbaDetail={{ view_uri: 'https://access.redhat.com/solutions/12345678', publishedTitle: 'Lorem ipsum article' }}
        kbaLoading={false}
      />
    );
  });

  it('renders component', () => {
    cy.get(ROOT);
  });

  it('renders correct number of headers', () => {
    cy.get('.pf-c-card__header').should('have.length', HEADERS.length);
    HEADERS.forEach((h) => cy.get('.pf-c-card__header').contains(h).should('have.length', 1));
  });

  it('each header has an icon', () => {
    cy.get('.pf-c-card__header > .ins-c-report-details__icon').should('have.length', HEADERS.length);
  });

  it('links have an icon', () => {
    cy.get('a > [class="fas fa-external-link-alt"]').should('have.length', 3);
  });

  it('renders lists with ol, ul, and li tags', () => {
    cy.get('ol ul > li').should('have.length', 3);
  });

  it('renders code blocks with pre and code tags', () => {
    cy.get('pre code').should('have.length', 7);
  });

  it('renders table correctly', () => {
    cy.get('table > tbody').within(() => {
      cy.get('tr').should('have.length', 2);
      cy.get('tr > td').eq(0).should('contain', 'eth0');
      cy.get('tr > td').eq(1).should('contain', 'fe81::c547:c849:ee14:2bdc');
      cy.get('tr > th').should('have.length', 2);
      cy.get('tr > th').eq(0).should('contain', 'Interface');
      cy.get('tr > th').eq(1).should('contain', 'IPv6 Address');
    });
  });

  it('renders three dividers', () => {
    cy.get('hr[class=pf-c-divider]').should('have.length', 3);
  });

  it('renders a loaded kba link', () => {
    cy.get(`${ROOT} .ins-c-report-details__kba .pf-c-card__body`).find('.pf-c-skeleton').should('have.length', 0);
    cy.get(`${ROOT} .ins-c-report-details__kba .pf-c-card__body`).contains('Lorem ipsum article');
  });
});

describe('report details: kba loading', () => {
  beforeEach(() => {
    mount(<ReportDetails report={report} kbaDetail={undefined} kbaLoading={true} />);
  });

  it('renders skeleton instead of a kba link', () => {
    cy.get(`${ROOT} .ins-c-report-details__kba .pf-c-card__body`).find('.pf-c-skeleton').should('have.length', 1);
  });
});
