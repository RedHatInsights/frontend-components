import { useIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import AngleDoubleDownIcon from '@patternfly/react-icons/dist/dynamic/icons/angle-double-down-icon';
import AngleDoubleUpIcon from '@patternfly/react-icons/dist/dynamic/icons/angle-double-up-icon';
import CriticalRiskIcon from '@patternfly/react-icons/dist/dynamic/icons/critical-risk-icon';
import EqualsIcon from '@patternfly/react-icons/dist/dynamic/icons/equals-icon';
import { Label, LabelProps } from '@patternfly/react-core/dist/dynamic/components/Label';
import React from 'react';

import { severityFormatters } from '../localization';
type InsightsLabelValueMapping = {
  [key: number]: {
    icon: React.ReactNode;
    formatText: (typeof severityFormatters)[keyof typeof severityFormatters];
    color: 'blue' | 'orange' | 'red' | 'yellow';
  };
};
const VALUE_TO_STATE: InsightsLabelValueMapping = {
  1: {
    icon: <AngleDoubleDownIcon />,
    formatText: severityFormatters.Low,
    color: 'blue',
  },
  2: {
    icon: <EqualsIcon />,
    formatText: severityFormatters.Moderate,
    color: 'yellow',
  },
  3: {
    icon: <AngleDoubleUpIcon />,
    formatText: severityFormatters.Important,
    color: 'orange',
  },
  4: {
    icon: <CriticalRiskIcon />,
    formatText: severityFormatters.Critical,
    color: 'red',
  },
};
export interface InsightsLabelProps extends LabelProps {
  value?: number;
  text?: React.ReactNode;
  hideIcon?: boolean;
  className?: string;
  /**
   * @deprecated Please do not use the rest object to pass default PF label props. Assing props directly to insights label element
   */
  rest: {
    [key: string]: any;
  };
}
const InsightsLabel = ({ value = 1, text, hideIcon, rest, ...props }: InsightsLabelProps) => {
  const intl = useIntlWithFallback();
  return (
    <Label {...rest} {...props} color={VALUE_TO_STATE[value].color} icon={!hideIcon && VALUE_TO_STATE[value].icon}>
      {text || VALUE_TO_STATE[value].formatText(intl)}
    </Label>
  );
};
export default InsightsLabel;
