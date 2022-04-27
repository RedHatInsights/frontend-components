import './labels.scss';

import { AngleDoubleDownIcon } from '@patternfly/react-icons';
import { AngleDoubleUpIcon } from '@patternfly/react-icons';
import { CriticalRiskIcon } from '@patternfly/react-icons';
import { EqualsIcon } from '@patternfly/react-icons';
import { Label, LabelProps } from '@patternfly/react-core';
import React from 'react';

type InsightsLabelValueMapping = {
  [key: number]: {
    icon: React.ReactNode;
    text: string;
    color: string;
  };
};
const VALUE_TO_STATE: InsightsLabelValueMapping = {
  1: { icon: <AngleDoubleDownIcon />, text: 'Low', color: 'pf-m-blue' },
  2: { icon: <EqualsIcon />, text: 'Moderate', color: 'ins-c-label-2' },
  3: { icon: <AngleDoubleUpIcon />, text: 'Important', color: 'pf-m-orange' },
  4: { icon: <CriticalRiskIcon />, text: 'Critical', color: 'pf-m-red' },
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
    <Label {...rest} {...props} className={VALUE_TO_STATE[value].color} icon={!hideIcon && VALUE_TO_STATE[value].icon}>
      {text || VALUE_TO_STATE[value].text}
    </Label>
  );
};

export default InsightsLabel;
