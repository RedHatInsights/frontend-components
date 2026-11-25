import { mount } from 'cypress/react18';
import { IntlProvider } from 'react-intl';
import Notification from '../../src/Notification';
import '@patternfly/patternfly/patternfly.css';

const notification = { id: 'opaque-id', title: 'Title', description: 'Description', variant: 'success', dismissable: false };

describe('localized notification defaults', () => {
  it('preserves the whole English tracking message', () => {
    mount(<Notification {...notification} sentryId="some-UUID" />);
    cy.contains('Tracking Id: some-UUID').should('be.visible');
  });
  it('translates whole identification messages without changing opaque IDs', () => {
    mount(
      <IntlProvider
        locale="fr"
        messages={{
          'notifications.notification.trackingId': '{id} [tracking]',
          'notifications.notification.requestId': '[request] {id}',
        }}
      >
        <Notification {...notification} sentryId="000123" requestId="000456" />
      </IntlProvider>,
    );
    cy.contains('000123 [tracking]').should('be.visible');
    cy.contains('[request] 000456').should('be.visible');
  });
});
