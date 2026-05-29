import messages from '../../fixtures/messages.json';
import RuleRating, { DEBOUNCE_TIMEOUT } from '../../../src/RuleRating/RuleRating';
import { Rating } from '../../../src/types';

const defaultProps = {
  ruleId: 'test-rule-1',
  ruleRating: 0 as Rating,
  onVoteClick: cy.stub().as('onVoteClick'),
  messages,
};

describe('RuleRating', () => {
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
    cy.get('.ins-c-like').should('have.length', 1);
    cy.get('.ins-c-dislike').should('have.length', 0);
  });

  it('shows filled thumbs down icon when rating is -1', () => {
    cy.mount(<RuleRating {...defaultProps} ruleRating={-1} />);
    cy.get('.ins-c-dislike').should('have.length', 1);
    cy.get('.ins-c-like').should('have.length', 0);
  });

  it('shows outlined icons when rating is 0', () => {
    cy.mount(<RuleRating {...defaultProps} ruleRating={0} />);
    cy.get('.ins-c-like').should('have.length', 0);
    cy.get('.ins-c-dislike').should('have.length', 0);
  });

  it('shows thank you message after clicking thumbs up', () => {
    cy.mount(<RuleRating {...defaultProps} />);
    cy.get('[aria-label="thumbs-up"]').click();
    cy.contains(messages.feedbackThankYou);
  });

  it('calls onVoteClick with correct args after debounce', () => {
    const onVoteClick = cy.stub().as('onVoteClick');
    cy.mount(<RuleRating {...defaultProps} onVoteClick={onVoteClick} />);
    cy.get('[aria-label="thumbs-up"]').click();
    cy.wait(DEBOUNCE_TIMEOUT + 100);
    cy.get('@onVoteClick').should('have.been.calledWith', 'test-rule-1', 1);
  });

  it('toggles rating off when clicking same vote twice', () => {
    const onVoteClick = cy.stub().as('onVoteClick');
    cy.mount(<RuleRating {...defaultProps} ruleRating={1} onVoteClick={onVoteClick} />);
    cy.get('[aria-label="thumbs-up"]').click();
    cy.wait(DEBOUNCE_TIMEOUT + 100);
    cy.get('@onVoteClick').should('have.been.calledWith', 'test-rule-1', 0);
  });

  it('cancels debounced callback on unmount', () => {
    const onVoteClick = cy.stub().as('onVoteClick');
    cy.mount(<RuleRating {...defaultProps} onVoteClick={onVoteClick} />);
    cy.get('[aria-label="thumbs-up"]').click();
    // Unmount before debounce fires by mounting something else
    cy.mount(<div>unmounted</div>);
    cy.wait(DEBOUNCE_TIMEOUT + 100);
    cy.get('@onVoteClick').should('not.have.been.called');
  });
});
