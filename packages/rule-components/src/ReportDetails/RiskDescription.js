import React from 'react';
import { Content, ContentVariants } from '@patternfly/react-core/dist/dynamic/components/Content';
import PropTypes from 'prop-types';

const RiskDescription = ({ riskValue, riskMeta, showDescription }) => {
  // riskValue ranges from 1 to ∞
  const { IconComponent, description } = riskMeta[riskValue - 1];

  return (
    <div className="ins-c-rule__risk-description">
      <IconComponent value={riskValue} />
      {showDescription && (
        <Content className="ins-c-rule__risk-detail-description-text" component={ContentVariants.small}>
          {description}
        </Content>
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
