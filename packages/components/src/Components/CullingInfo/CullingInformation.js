import React from 'react';
import PropTypes from 'prop-types';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import { Tooltip } from '@patternfly/react-core/dist/js/components/Tooltip/Tooltip';
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
    if (diffTime >= 0 && removeIn <= 1) {
        return {
            isError: true,
            msg: `This system is scheduled for removal from inventory`
        };
    }

    return {
        isWarn: diffTime >= 0,
        msg: `This system will be removed from the inventory in ${removeIn} days`
    };
};

const CullingInformation = ({ culled, className, staleWarning, stale, currDate, children, ...props }) => {
    if ((new Date(currDate) - new Date(stale)) < 0) {
        return children;
    }

    const { isWarn, isError, msg } = calculateTooltip(culled, staleWarning, currDate);
    return <React.Fragment>
        <Tooltip
            { ...props }
            content={msg}
            position="bottom"
        >
            <span className={
                classnames({
                    'ins-c-inventory__culling-warning': isWarn,
                    'ins-c-inventory__culling-danger': isError
                })
            }>
                { isError && <ExclamationCircleIcon /> }
                { isWarn && <ExclamationTriangleIcon /> }
                {children}
            </span>
        </Tooltip>
    </React.Fragment>;
};

CullingInformation.propTypes = {
    culled: PropTypes.oneOfType([ PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date) ]),
    staleWarning: PropTypes.oneOfType([ PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date) ]),
    stale: PropTypes.oneOfType([ PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date) ]),
    currDate: PropTypes.oneOfType([ PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date) ])
};
CullingInformation.defaultProps = {
    culled: new Date(0),
    staleWarning: new Date(0),
    currDate: new Date()
};
export default CullingInformation;
