import React from 'react';
import PropTypes from 'prop-types';

const RuleFeedback = ruleId => (
    <div>
        <div>Is this rule helpful?</div>
        {/* TODO: add like/dislike buttons here */}
    </div>
);

RuleFeedback.propTypes = {
    ruleId: PropTypes.number,
};

export default RuleFeedback;
