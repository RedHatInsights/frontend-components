import React from 'react';
import propTypes from 'prop-types';
import {
    EmptyState, EmptyStateBody,
    Title,
    Stack, StackItem, EmptyStateIcon
} from '@patternfly/react-core';
import IconMaintenance from './icon-maintenance';

import './maintenance.scss';

const Maintenance = ({ startTime, endTime, timeZone, description }) => {
    return (
        <EmptyState className='ins-c-empty-state__maintenance'>
            <EmptyStateIcon icon={IconMaintenance}/>
            <Title headingLevel='h4' size='lg'>Maintenance in progress</Title>
            <EmptyStateBody>
                { description
                    ? { description }
                    : <Stack>
                        <StackItem>We are currently undergoing scheduled maintenance from {startTime}-{endTime} {timeZone}.</StackItem>
                        <StackItem>We will be back shortly, thank you for your patience</StackItem>
                    </Stack>
                }
            </EmptyStateBody>
        </EmptyState>
    );
};

Maintenance.propTypes = {
    startTime: propTypes.string,
    endTime: propTypes.string,
    timeZone: propTypes.string,
    description: propTypes.node
};

Maintenance.defaultProps = {
    startTime: '6am',
    endTime: '8am',
    timeZone: 'EST'
};

export default Maintenance;
