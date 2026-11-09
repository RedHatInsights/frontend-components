import { FormattedMessage, IntlContext, getIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Icon } from '@patternfly/react-core/dist/dynamic/components/Icon';
import ThumbsUpIcon from '@patternfly/react-icons/dist/dynamic/icons/thumbs-up-icon';
import OutlinedThumbsUpIcon from '@patternfly/react-icons/dist/dynamic/icons/outlined-thumbs-up-icon';
import ThumbsDownIcon from '@patternfly/react-icons/dist/dynamic/icons/thumbs-down-icon';
import OutlinedThumbsDownIcon from '@patternfly/react-icons/dist/dynamic/icons/outlined-thumbs-down-icon';
import messages from '../messages';

export const feedback = { negative: -1, neutral: 0, positive: 1 };
// ruleId - is id of current rule
// onFeedbackChanged(ruleId, vote) is a callback which is called when feedback is changed
// where ruleId is id of the rule, vote is either -1, 0 or 1
class RuleFeedback extends React.Component {
  static contextType = IntlContext;
  state = { feedbackSaved: false };

  handleFeedbackChange = (vote) => {
    const { ruleId, userVote, onFeedbackChanged } = this.props;
    if (userVote === vote) {
      onFeedbackChanged(ruleId, feedback.neutral);
    } else {
      this.setState({ feedbackSaved: true });
      onFeedbackChanged(ruleId, vote);
    }
  };
  render() {
    const intl = getIntlWithFallback(this.context);
    const { userVote } = this.props;
    return (
      <div>
        <span>
          <FormattedMessage {...messages.ruleFeedbackIsThisHelpful} />
        </span>
        <Button
          icon={
            <Icon color={userVote === feedback.positive ? 'var(--pf-t--global--icon--color--status--success--default)' : undefined}>
              {userVote === feedback.positive ? <ThumbsUpIcon /> : <OutlinedThumbsUpIcon />}
            </Icon>
          }
          className="ins-c-rule__rule-feedback-like-button"
          variant="plain"
          aria-label={intl.formatMessage(messages.ruleFeedbackHelpful)}
          onClick={() => this.handleFeedbackChange(feedback.positive)}
        />
        <Button
          icon={
            <Icon color={userVote === feedback.negative ? 'var(--pf-t--global--icon--color--brand--default)' : undefined}>
              {userVote === feedback.negative ? <ThumbsDownIcon /> : <OutlinedThumbsDownIcon />}
            </Icon>
          }
          className="ins-c-rule__rule-feedback-dislike-button"
          variant="plain"
          aria-label={intl.formatMessage(messages.ruleFeedbackNotHelpful)}
          onClick={() => this.handleFeedbackChange(feedback.negative)}
        />
        {this.state.feedbackSaved && <FormattedMessage {...messages.ruleFeedbackThanks} />}
      </div>
    );
  }
}

RuleFeedback.propTypes = {
  ruleId: PropTypes.string.isRequired,
  userVote: PropTypes.oneOf(Object.values(feedback)).isRequired,
  onFeedbackChanged: PropTypes.func.isRequired,
};

export default RuleFeedback;
