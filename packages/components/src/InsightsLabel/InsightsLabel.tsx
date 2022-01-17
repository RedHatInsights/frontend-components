import './labels.scss';

import { AngleDoubleDownIcon } from '@patternfly/react-icons';
import { AngleDoubleUpIcon } from '@patternfly/react-icons';
import CriticalIcon from './CriticalIcon';
import { EqualsIcon } from '@patternfly/react-icons';
import { Label, LabelProps } from '@patternfly/react-core';
import React from 'react';
import classNames from 'classnames';

type InsightsLabelValueMapping = {
  [key: number]: {
    icon: React.ReactNode;
    text: string;
  };
};
const VALUE_TO_STATE: InsightsLabelValueMapping = {
  1: { icon: <AngleDoubleDownIcon />, text: 'Low' },
  2: { icon: <EqualsIcon />, text: 'Moderate' },
  3: { icon: <AngleDoubleUpIcon />, text: 'Important' },
  4: { icon: <CriticalIcon />, text: 'Critical' },
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
    <Label {...rest} {...props} className={classNames(className, `ins-c-label-${value}`)} icon={!hideIcon && VALUE_TO_STATE[value].icon}>
      {text || VALUE_TO_STATE[value].text}
    </Label>
  );
};

export default InsightsLabel;
