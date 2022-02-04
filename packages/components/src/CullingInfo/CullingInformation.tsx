import React from 'react';
import { ExclamationCircleIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';
import { Tooltip, TooltipProps } from '@patternfly/react-core';
import classnames from 'classnames';
import './CullingInformation.scss';
import { CullingDate, calculateTooltip, CullingInfo } from './utils';
export type Render = (config: { msg: string }) => React.ReactElement<any, any> | null;

export interface CullingInformation extends TooltipProps {
  className: string;
  staleWarning: CullingDate;
  culled: CullingDate;
  stale: CullingDate;
  currDate: CullingDate;
  children?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
  render?: Render;
}

const CullingInformation: React.FunctionComponent<CullingInformation> = ({
  culled = new Date(0),
  className,
  staleWarning = new Date(0),
  stale = new Date(0),
  currDate = new Date(0),
  children,
  render,
  ...props
}) => {
  if (new Date(currDate).valueOf() - new Date(stale).valueOf() < 0) {
    return render
      ? render({
          msg: '',
        })
      : children || null;
  }

  const { isWarn, isError, msg }: CullingInfo = calculateTooltip(culled, staleWarning, currDate);
  if (render) {
    return (
      <span
        className={classnames(
          {
            'ins-c-inventory__culling-warning': isWarn,
            'ins-c-inventory__culling-danger': isError,
          },
          className
        )}
      >
        {isWarn && <ExclamationTriangleIcon />}
        {isError && <ExclamationCircleIcon />}
        {render({ msg })}
      </span>
    );
  }

  return (
    <React.Fragment>
      <Tooltip {...props} content={msg} position="bottom">
        <span
          className={classnames(
            {
              'ins-c-inventory__culling-warning': isWarn,
              'ins-c-inventory__culling-danger': isError,
            },
            className
          )}
        >
          {isError && <ExclamationCircleIcon />}
          {isWarn && <ExclamationTriangleIcon />}
          {children}
        </span>
      </Tooltip>
    </React.Fragment>
  );
};

export default CullingInformation;
