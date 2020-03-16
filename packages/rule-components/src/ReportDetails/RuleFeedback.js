import React from 'react';
import PropTypes from 'prop-types';
import ThumbsUpIcon from '@patternfly/react-icons/dist/js/icons/outlined-thumbs-up-icon';
import ThumbsDownIcon from '@patternfly/react-icons/dist/js/icons/outlined-thumbs-down-icon';
import { Button } from '@patternfly/react-core';

// ruleId - is id of current rule
// onFeedbackSent(ruleId, vote, text) is a callback which is called when feedback is changed
// where ruleId is id of the rule, vote is either -1, 0 or 1 and text is a string
const RuleFeedback = ({ ruleId, onFeedbackChanged }) => (
    <div>
        <span>Is this rule helpful?</span>
        <Button
            className="ins-c-rule__rule-feedback-like-button"
            variant="plain"
            aria-label="Rule is helpful"
            onClick={ () => onFeedbackChanged(ruleId, 1, '') }
        >
            <ThumbsUpIcon/>
        </Button>
        <Button
            className="ins-c-rule__rule-feedback-like-button"
            variant="plain"
            aria-label="Rule is not helpful"
            onClick={ () => onFeedbackChanged(ruleId, -1, '') }
        >
            <ThumbsDownIcon/>
        </Button>
    </div>
);

RuleFeedback.propTypes = {
    ruleId: PropTypes.string.isRequired,
    onFeedbackChanged: PropTypes.func.isRequired
};

export default RuleFeedback;
