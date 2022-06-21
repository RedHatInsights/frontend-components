import './labels.scss';

import { AngleDoubleDownIcon, AngleDoubleUpIcon, CriticalRiskIcon, EqualsIcon } from '@patternfly/react-icons';
import { Label, LabelProps } from '@patternfly/react-core';
import React from 'react';

type InsightsLabelValueMapping = {
  [key: number]: {
    icon: React.ReactNode;
    text: string;
    color: 'blue' | 'orange' | 'red' | undefined;
  };
};
const VALUE_TO_STATE: InsightsLabelValueMapping = {
  1: { icon: <AngleDoubleDownIcon />, text: 'Low', color: 'blue' },
  2: { icon: <EqualsIcon />, text: 'Moderate', color: undefined },
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

const InsightsLabel: React.FunctionComponent<InsightsLabelProps> = ({ value = 1, text, hideIcon, className, rest, ...props }) => {
  return (
    <Label
      {...rest}
      {...props}
      className={value === 2 ? 'ins-c-label-2' : ''}
      color={VALUE_TO_STATE[value].color}
      icon={!hideIcon && VALUE_TO_STATE[value].icon}
    >
      {text || VALUE_TO_STATE[value].text}
    </Label>
  );
};

export default InsightsLabel;
