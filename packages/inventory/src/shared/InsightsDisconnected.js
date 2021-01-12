import React from 'react';

import { Tooltip } from '@patternfly/react-core';
import { DisconnectedIcon } from '@patternfly/react-icons';

import './InsightsDisconnected.scss';

const InsightsDisconnected = () => (
    <Tooltip content="Insights disabled">
        <span className="pf-u-ml-sm ins-c-inventor__disconnected-icon">
            <DisconnectedIcon />
        </span>
    </Tooltip>
);

export default InsightsDisconnected;
