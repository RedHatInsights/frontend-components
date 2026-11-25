import { IntlProvider } from 'react-intl';
import { mount } from 'cypress/react18';
import ReportDetails from '../../src/ReportDetails';
import '@patternfly/patternfly/patternfly.css';

const changeLevels = ['Very Low', 'Low', 'Moderate', 'High'];
const totalLevels = ['Low', 'Moderate', 'Important', 'Critical'];

const expectExplanations = (total, change) => {
  cy.get('.ins-c-rule__risk-detail-description-text').should(($descriptions) => {
    expect(Array.from($descriptions, (node) => node.textContent)).to.deep.equal([total, change]);
  });
};

describe('rule report risk explanations', () => {
  totalLevels.forEach((level, index) => {
    it(`preserves English ${level} total risk and ${changeLevels[index]} remediation risk`, () => {
      mount(<ReportDetails details="Recommendation details" totalRisk={index + 1} riskOfChange={index + 1} />);
      expectExplanations(`${level} severity desc for total risk`, `${changeLevels[index]} severity desc for risk of change`);
    });
  });

  it('uses caller translations for each whole explanation', () => {
    mount(
      <IntlProvider
        locale="fr"
        onError={() => {}}
        messages={{
          'ruleComponents.risk.totalRiskDescription0': '[fr] issue risk',
          'ruleComponents.risk.riskOfChangeDescription0': '[fr] remediation risk',
        }}
      >
        <ReportDetails details="Recommendation details" totalRisk={1} riskOfChange={1} />
      </IntlProvider>,
    );
    expectExplanations('[fr] issue risk', '[fr] remediation risk');
  });
});
