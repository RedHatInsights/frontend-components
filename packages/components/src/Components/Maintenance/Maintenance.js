import React from 'react';
import propTypes from 'prop-types';

import {
    EmptyState, EmptyStateBody,
    Title,
    Stack, StackItem, EmptyStateIcon
} from '@patternfly/react-core';
import { HourglassHalfIcon } from '@patternfly/react-icons';

import './maintenance.scss';

const Maintenance = ({ utcStartTime, utcEndTime, startTime, endTime, timeZone, description, redirectLink, ...props}) => {

    return (
        <EmptyState className='ins-c-empty-state__maintenance'>
            <EmptyStateIcon icon={HourglassHalfIcon}/>
            <Title headingLevel='h4' size='lg'>Maintenance in progress</Title>
            <EmptyStateBody>
                { description
                    ? description
                    : <Stack>
                        <StackItem>We are currently undergoing scheduled maintenance and will be</StackItem>
                        <StackItem>unavailable from from {utcStartTime}-{utcEndTime} UTC ({startTime}-{endTime} {timeZone}.)</StackItem>
                        <StackItem>For more information please visit <a href={redirectLink}>status.redhat.com</a></StackItem>
                    </Stack>
                }
            </EmptyStateBody>
        </EmptyState>
    );
};

Maintenance.propTypes = {
    utcStartTime: propTypes.string,
    utcEndTime: propTypes.string, 
    startTime: propTypes.string,
    endTime: propTypes.string,
    timeZone: propTypes.string,
    description: propTypes.node,
    redirectLink: propTypes.string
};

Maintenance.defaultProps = {
    utcStartTime: '10am',
    utcEndTime: '12am',
    startTime: '6am',
    endTime: '8am',
    timeZone: 'EST', 
    redirectLink: 'https://status.redhat.com/incidents/qw4mmmyzwzdg'
};

export default Maintenance;
