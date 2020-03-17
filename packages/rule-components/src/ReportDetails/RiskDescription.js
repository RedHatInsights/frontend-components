import React from 'react';
import { Text, TextVariants } from '@patternfly/react-core';
import PropTypes from 'prop-types';

const RiskDescription = ({ riskValue, riskMeta }) => {
    // riskValue ranges from 1 to ∞
    const { IconComponent, label, description } = riskMeta[riskValue - 1];

    return (
        <div className="ins-c-rule__risk-description">
            <div className={ `ins-c-rule__battery ins-c-rule__severity-level-${ riskValue }` }>
                <IconComponent label={ label } severity={ riskValue }/>
            </div>
            <Text
                className="ins-c-rule__risk-detail-description-text"
                component={ TextVariants.small }
            >
                { description }
            </Text>
        </div>
    );
};

RiskDescription.propTypes = {
    riskValue: PropTypes.number,
    riskMeta: PropTypes.array
};

export default RiskDescription;
