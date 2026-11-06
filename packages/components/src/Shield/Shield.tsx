import { useIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import { Icon } from '@patternfly/react-core/dist/dynamic/components/Icon';
import { IconComponentProps } from '@patternfly/react-core/dist/dynamic/components/Icon';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import QuestionIcon from '@patternfly/react-icons/dist/dynamic/icons/question-icon';
import SecurityIcon from '@patternfly/react-icons/dist/dynamic/icons/security-icon';
import { SVGIconProps } from '@patternfly/react-icons/dist/js/createIcon';
import React from 'react';
import { impactList } from './consts';
import { impactFormatters, severityFormatters } from '../localization';
export interface ShieldProps {
  impact: keyof typeof impactList | 'N/A';
  hasLabel?: boolean;
  hasTooltip?: boolean;
  disableQuestionIcon?: boolean;
  size?: IconComponentProps['size'];
}
const Shield = ({ impact = 'N/A', hasLabel = false, size = 'md', hasTooltip = true, disableQuestionIcon = false }: ShieldProps) => {
  const intl = useIntlWithFallback();
  const attributes = impactList?.[impact as keyof typeof impactList] ?? impactList.Unknown;
  const title = severityFormatters[attributes.title as keyof typeof severityFormatters](intl);
  const message = impactFormatters[(String(impact) in impactFormatters ? String(impact) : 'Unknown') as keyof typeof impactFormatters](intl);
  const badgeProps: SVGIconProps = {
    'aria-hidden': 'false',
    'aria-label': title,
    color: attributes.color,
  };
  const badge =
    attributes.title === 'Unknown' ? (
      disableQuestionIcon ? null : (
        <Icon size={size}>
          <QuestionIcon {...badgeProps} />
        </Icon>
      )
    ) : (
      <Icon size={size}>
        <SecurityIcon {...badgeProps} />
      </Icon>
    );
  const body = (
    <span>
      {badge} {hasLabel && title}
    </span>
  );
  return (
    <span>
      {hasTooltip ? (
        <Tooltip content={<div>{message}</div>} position={'bottom'}>
          {body}
        </Tooltip>
      ) : (
        body
      )}
    </span>
  );
};
export default Shield;
