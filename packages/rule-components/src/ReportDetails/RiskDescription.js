import React from 'react';
import { Text, TextVariants } from '@patternfly/react-core';
import PropTypes from 'prop-types';

const RiskDescription = ({ riskValue, riskMeta, showDescription }) => {
  // riskValue ranges from 1 to ∞
  const { IconComponent, description } = riskMeta[riskValue - 1];

  return (
    <div className="ins-c-rule__risk-description">
      <IconComponent value={riskValue} />
      {showDescription && (
        <Text className="ins-c-rule__risk-detail-description-text" component={TextVariants.small}>
          {description}
        </Text>
      )}
    </div>
  );
};

RiskDescription.propTypes = {
  riskValue: PropTypes.number,
  riskMeta: PropTypes.array,
  showDescription: PropTypes.bool,
};

export default RiskDescription;
