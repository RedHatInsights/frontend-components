import React from 'react';
import PropTypes from 'prop-types';

const RuleFeedback = ({ ruleId }) => (
    <div>
        <div>
            <span>Is this rule helpful?</span>
            <i className="far fa-thumbs-up"></i>
            <i className="far fa-thumbs-down"></i>
        </div>
    </div>
);

RuleFeedback.propTypes = {
    ruleId: PropTypes.number,
};

export default RuleFeedback;
