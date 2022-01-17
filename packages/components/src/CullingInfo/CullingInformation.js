import React from 'react';
import PropTypes from 'prop-types';
import { ExclamationCircleIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';
import { Tooltip } from '@patternfly/react-core';
import classnames from 'classnames';
import './CullingInformation.scss';

const seconds = 1000;
const minutes = seconds * 60;
const hours = minutes * 60;
const days = hours * 24;

const calculateTooltip = (culled, warning, currDate) => {
  const culledDate = new Date(culled);
  const warningDate = new Date(warning);
  const diffTime = currDate - warningDate;
  const removeIn = Math.ceil((culledDate - currDate) / days);
  const msg = `System scheduled for inventory removal in ${removeIn} days`;
  if (diffTime >= 0) {
    return {
      isError: true,
      msg,
    };
  }

  return {
    isWarn: true,
    msg,
  };
};

const CullingInformation = ({ culled, className, staleWarning, stale, currDate, children, render, ...props }) => {
  // TODO: remove comments once culling is fine
  if (new Date(currDate) - new Date(stale) < 0) {
    return render
      ? render({
          msg: '',
        })
      : children;
  }

  const { isWarn, isError, msg } = calculateTooltip(culled, staleWarning, currDate);
  if (render) {
    return (
      <span
        className={classnames({
          'ins-c-inventory__culling-warning': isWarn,
          'ins-c-inventory__culling-danger': isError,
        })}
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
          className={classnames({
            'ins-c-inventory__culling-warning': isWarn,
            'ins-c-inventory__culling-danger': isError,
          })}
        >
          {isError && <ExclamationCircleIcon />}
          {isWarn && <ExclamationTriangleIcon />}
          {children}
        </span>
      </Tooltip>
    </React.Fragment>
  );
};

CullingInformation.propTypes = {
  culled: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
  staleWarning: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
  stale: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
  currDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
  render: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
};
CullingInformation.defaultProps = {
  culled: new Date(0),
  staleWarning: new Date(0),
  currDate: new Date(),
};
export default CullingInformation;
