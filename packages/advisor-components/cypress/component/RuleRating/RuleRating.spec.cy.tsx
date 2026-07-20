import messages from '../../fixtures/messages.json';
import RuleRating, { DEBOUNCE_TIMEOUT } from '../../../src/RuleRating/RuleRating';
import { Rating } from '../../../src/types';

describe('RuleRating', () => {
  let defaultProps: {
    ruleId: string;
    ruleRating: Rating;
    onVoteClick: ReturnType<typeof cy.stub>;
    messages: typeof messages;
  };

  beforeEach(() => {
    defaultProps = {
      ruleId: 'test-rule-1',
      ruleRating: 0 as Rating,
      onVoteClick: cy.stub().as('onVoteClick'),
      messages,
    };
  });

  it('renders the component with helpful text', () => {
    cy.mount(<RuleRating {...defaultProps} />);
    cy.contains(messages.ruleHelpful);
  });

  it('renders thumbs up and thumbs down buttons', () => {
    cy.mount(<RuleRating {...defaultProps} />);
    cy.get('[aria-label="thumbs-up"]').should('exist');
    cy.get('[aria-label="thumbs-down"]').should('exist');
  });

  it('shows filled thumbs up icon when rating is 1', () => {
    cy.mount(<RuleRating {...defaultProps} ruleRating={1} />);
    cy.get('[data-testid="thumbs-up-filled"]').should('exist');
    cy.get('[data-testid="thumbs-down-filled"]').should('not.exist');
  });

  it('shows filled thumbs down icon when rating is -1', () => {
    cy.mount(<RuleRating {...defaultProps} ruleRating={-1} />);
    cy.get('[data-testid="thumbs-down-filled"]').should('exist');
    cy.get('[data-testid="thumbs-up-filled"]').should('not.exist');
  });

  it('shows outlined icons when rating is 0', () => {
    cy.mount(<RuleRating {...defaultProps} ruleRating={0} />);
    cy.get('[data-testid="thumbs-up-outlined"]').should('exist');
    cy.get('[data-testid="thumbs-down-outlined"]').should('exist');
  });

  it('shows thank you message after clicking thumbs up', () => {
    cy.mount(<RuleRating {...defaultProps} />);
    cy.get('[aria-label="thumbs-up"]').click();
    cy.contains(messages.feedbackThankYou);
  });

  it('calls onVoteClick with correct args after debounce', () => {
    cy.clock();
    const onVoteClick = cy.stub().as('onVoteClick');
    cy.mount(<RuleRating {...defaultProps} onVoteClick={onVoteClick} />);
    cy.get('[aria-label="thumbs-up"]').click();
    cy.tick(DEBOUNCE_TIMEOUT);
    cy.get('@onVoteClick').should('have.been.calledWith', 'test-rule-1', 1);
  });

  it('toggles rating off when clicking same vote twice', () => {
    cy.clock();
    const onVoteClick = cy.stub().as('onVoteClick');
    cy.mount(<RuleRating {...defaultProps} ruleRating={1} onVoteClick={onVoteClick} />);
    cy.get('[aria-label="thumbs-up"]').click();
    cy.tick(DEBOUNCE_TIMEOUT);
    cy.get('@onVoteClick').should('have.been.calledWith', 'test-rule-1', 0);
  });

  it('cancels debounced callback on unmount', () => {
    cy.clock();
    const onVoteClick = cy.stub().as('onVoteClick');
    cy.mount(<RuleRating {...defaultProps} onVoteClick={onVoteClick} />);
    cy.get('[aria-label="thumbs-up"]').click();
    // Unmount before debounce fires by mounting something else
    cy.mount(<div>unmounted</div>);
    cy.tick(DEBOUNCE_TIMEOUT);
    cy.get('@onVoteClick').should('not.have.been.called');
  });

  // Keyboard navigation (Enter/Space) is handled natively by the <button>
  // element rendered by PatternFly's Button component. Cypress synthetic
  // events (cy.type) do not trigger the browser's built-in key-to-click
  // behavior, so these interactions cannot be reliably tested here.
});
