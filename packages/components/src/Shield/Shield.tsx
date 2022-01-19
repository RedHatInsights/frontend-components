import { Tooltip } from '@patternfly/react-core';
import { QuestionIcon, SecurityIcon, IconSize } from '@patternfly/react-icons';
import { SVGIconProps } from '@patternfly/react-icons/dist/js/createIcon';
import React from 'react';
import { impactList } from './consts';

export interface ShieldProps {
  impact: keyof typeof impactList;
  hasLabel: boolean;
  hasTooltip: boolean;
  size: IconSize | keyof typeof IconSize;
}

const Shield: React.FunctionComponent<ShieldProps> = ({ impact, hasLabel = false, size = 'sm', hasTooltip = true }) => {
  const attributes = impactList?.[impact] ?? impactList.Unknown;
  const badgeProps: SVGIconProps = {
    'aria-hidden': 'false',
    'aria-label': attributes.title,
    color: attributes.color,
    size,
  };

  const badge = attributes.title === 'Unknown' ? <QuestionIcon {...badgeProps} /> : <SecurityIcon {...badgeProps} />;

  const body = (
    <span>
      {badge} {hasLabel && attributes.title}
    </span>
  );

  return (
    <span>
      {hasTooltip ? (
        <Tooltip content={<div>{attributes.message}</div>} position={'bottom'}>
          {body}
        </Tooltip>
      ) : (
        body
      )}
    </span>
  );
};

export default Shield;
