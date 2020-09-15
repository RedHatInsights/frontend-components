import React from 'react';
import PropTypes from 'prop-types';
import { SecurityIcon } from '@patternfly/react-icons';
import { riskOfChangeMeta } from './constants';

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
const RiskOfChangeIcon = ({ value, ...props }) => {
    const label = riskOfChangeMeta[value - 1] && riskOfChangeMeta[value - 1].label;
    return <div className={ `ins-c-rule__battery battery ins-c-rule__severity-level-${ value }` }>
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
    </div>;
};

RiskOfChangeIcon.propTypes = {
    value: PropTypes.number.isRequired
};

RiskOfChangeIcon.defaultProps = {
    severity: 0
};

export default RiskOfChangeIcon;
