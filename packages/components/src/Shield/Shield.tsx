import { Icon, IconComponentProps, Tooltip } from '@patternfly/react-core';
import { QuestionIcon, SecurityIcon } from '@patternfly/react-icons';
import { SVGIconProps } from '@patternfly/react-icons/dist/js/createIcon';
import React from 'react';
import { impactList } from './consts';

export interface ShieldProps {
  impact: keyof typeof impactList | 'N/A';
  hasLabel?: boolean;
  hasTooltip?: boolean;
  size?: IconComponentProps['size'];
}

const Shield: React.FunctionComponent<ShieldProps> = ({ impact = 'N/A', hasLabel = false, size = 'md', hasTooltip = true }) => {
  const attributes = impactList?.[impact as keyof typeof impactList] ?? impactList.Unknown;
  const badgeProps: SVGIconProps = {
    'aria-hidden': 'false',
    'aria-label': attributes.title,
    color: attributes.color,
  };

  const badge = <Icon size={size}>{attributes.title === 'Unknown' ? <QuestionIcon {...badgeProps} /> : <SecurityIcon {...badgeProps} />}</Icon>;

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
