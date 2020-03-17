import React from 'react';
import PropTypes from 'prop-types';
import { SecurityIcon } from '@patternfly/react-icons';

/**
 * This is the RiskOfChangeIcon component
 * it accepts severity
 * which corresponds to a level 1-4
 * 1 - low - best case scenario
 * 2 - medium
 * 3 - high
 * 4 - critical - worst case scenario
 * Also accepts a label which can be made invisible
 */
const RiskOfChangeIcon = ({ severity, label, ...props }) => (
    <>
        <i
            widget-type='InsightsBattery'
            widget-id={ label }
            { ...props }
        >
            <SecurityIcon className="ins-c-risk-of-change__icon"/>
        </i>
        {
            label && label.length > 0 &&
            <span className="ins-c-risk-of-change__label">{ label }</span>
        }
    </>
);

RiskOfChangeIcon.propTypes = {
    severity: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.number.isRequired
    ]),
    label: PropTypes.string.isRequired
};

RiskOfChangeIcon.defaultProps = {
    severity: 'null'
};

export default RiskOfChangeIcon;
