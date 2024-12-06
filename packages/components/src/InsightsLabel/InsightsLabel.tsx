import AngleDoubleDownIcon from '@patternfly/react-icons/dist/dynamic/icons/angle-double-down-icon';
import AngleDoubleUpIcon from '@patternfly/react-icons/dist/dynamic/icons/angle-double-up-icon';
import CriticalRiskIcon from '@patternfly/react-icons/dist/dynamic/icons/critical-risk-icon';
import EqualsIcon from '@patternfly/react-icons/dist/dynamic/icons/equals-icon';
import { Label, LabelProps } from '@patternfly/react-core/dist/dynamic/components/Label';
import React from 'react';

type InsightsLabelValueMapping = {
  [key: number]: {
    icon: React.ReactNode;
    text: string;
    color: 'blue' | 'orange' | 'red' | 'yellow';
  };
};
const VALUE_TO_STATE: InsightsLabelValueMapping = {
  1: { icon: <AngleDoubleDownIcon />, text: 'Low', color: 'blue' },
  2: { icon: <EqualsIcon />, text: 'Moderate', color: 'yellow' },
  3: { icon: <AngleDoubleUpIcon />, text: 'Important', color: 'orange' },
  4: { icon: <CriticalRiskIcon />, text: 'Critical', color: 'red' },
};

export interface InsightsLabelProps extends LabelProps {
  value?: number;
  text?: React.ReactNode;
  hideIcon?: boolean;
  className?: string;
  /**
   * @deprecated Please do not use the rest object to pass default PF label props. Assing props directly to insights label element
   */
  rest: { [key: string]: any };
}

const InsightsLabel: React.FunctionComponent<InsightsLabelProps> = ({ value = 1, text, hideIcon, rest, ...props }) => {
  return (
    <Label {...rest} {...props} color={VALUE_TO_STATE[value].color} icon={!hideIcon && VALUE_TO_STATE[value].icon}>
      {text || VALUE_TO_STATE[value].text}
    </Label>
  );
};

export default InsightsLabel;
