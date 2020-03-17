import React from 'react';
import PropTypes from 'prop-types';
import ThumbsUpIcon from '@patternfly/react-icons/dist/js/icons/outlined-thumbs-up-icon';
import ThumbsDownIcon from '@patternfly/react-icons/dist/js/icons/outlined-thumbs-down-icon';

const RuleFeedback = ({ ruleId }) => (
    <div>
        <span>Is this rule helpful?</span>
        <ThumbsUpIcon/>
        <ThumbsDownIcon/>
    </div>
);

RuleFeedback.propTypes = {
    ruleId: PropTypes.number
};

export default RuleFeedback;
