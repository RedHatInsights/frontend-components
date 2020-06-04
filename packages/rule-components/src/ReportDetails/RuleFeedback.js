import React from 'react';
import PropTypes from 'prop-types';
import ThumbsUpIcon from '@patternfly/react-icons/dist/js/icons/thumbs-up-icon';
import OutlinedThumbsUpIcon from '@patternfly/react-icons/dist/js/icons/outlined-thumbs-up-icon';
import ThumbsDownIcon from '@patternfly/react-icons/dist/js/icons/thumbs-down-icon';
import OutlinedThumbsDownIcon from '@patternfly/react-icons/dist/js/icons/outlined-thumbs-down-icon';
import { Button } from '@patternfly/react-core';

export const feedback = { negative: -1, neutral: 0, positive: 1 };
// ruleId - is id of current rule
// onFeedbackSent(ruleId, vote) is a callback which is called when feedback is changed
// where ruleId is id of the rule, vote is either -1, 0 or 1
class RuleFeedback extends React.Component {
    state = { feedbackSaved: false }

    handleFeedbackChange = (vote) => {
        const { ruleId, userVote, onFeedbackChanged } = this.props;
        if (userVote === vote) {
            onFeedbackChanged(ruleId, 0);
        } else {
            this.setState({ feedbackSaved: true });
            onFeedbackChanged(ruleId, vote);
        }
    }
    render() {
        const { userVote } = this.props;
        return <div>
            <span>Is this helpful?</span>
            <Button
                className="ins-c-rule__rule-feedback-like-button"
                variant="plain"
                aria-label="Rule is helpful"
                onClick={ () => this.handleFeedbackChange(feedback.positive) }
            >
                {
                    userVote === feedback.positive
                        ? <ThumbsUpIcon color="var(--pf-global--success-color--200)"/>
                        : <OutlinedThumbsUpIcon/>
                }
            </Button>
            <Button
                className="ins-c-rule__rule-feedback-dislike-button"
                variant="plain"
                aria-label="Rule is not helpful"
                onClick={ () => this.handleFeedbackChange(feedback.negative) }
            >
                {
                    userVote === feedback.negative
                        ? <ThumbsDownIcon color="var(--pf-global--primary-color--100)"/>
                        : <OutlinedThumbsDownIcon/>
                }
            </Button>
            {this.state.feedbackSaved && 'Thank you for your feedback!'}
        </div>;
    }
};

RuleFeedback.propTypes = {
    ruleId: PropTypes.string.isRequired,
    userVote: PropTypes.oneOf(Object.values(feedback)).isRequired,
    onFeedbackChanged: PropTypes.func.isRequired
};

export default RuleFeedback;
