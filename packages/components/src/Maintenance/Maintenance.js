import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    EmptyState, EmptyStateBody,
    Title,
    Stack, StackItem, EmptyStateIcon
} from '@patternfly/react-core';
import { HourglassHalfIcon } from '@patternfly/react-icons';
import './maintenance.scss';

const Maintenance = ({ title, utcStartTime, utcEndTime, startTime, endTime, timeZone, description, redirectLink, className, ...props }) => {

    const emptyStateClassName = classNames(
        className,
        'ins-c-empty-state__maintenance'
    );

    return (
        <EmptyState className={emptyStateClassName} {...props}>
            <EmptyStateIcon icon={HourglassHalfIcon}/>
            <Title headingLevel='h4' size='lg'>Maintenance in progress</Title>
            <EmptyStateBody>
                { description
                    ? description
                    : <Stack>
                        <StackItem>We are currently undergoing scheduled maintenance and will be</StackItem>
                        <StackItem>unavailable from {utcStartTime} to {utcEndTime} UTC ({startTime}-{endTime} {timeZone}).</StackItem>
                        <StackItem>For more information please visit <a href={redirectLink}>status.redhat.com</a>.</StackItem>
                    </Stack>
                }
            </EmptyStateBody>
        </EmptyState>
    );
};

Maintenance.propTypes = {
    utcStartTime: PropTypes.string,
    utcEndTime: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    timeZone: PropTypes.string,
    description: PropTypes.node,
    redirectLink: PropTypes.string,
    title: PropTypes.node,
    className: PropTypes.string
};

Maintenance.defaultProps = {
    utcStartTime: '10am',
    utcEndTime: '12am',
    startTime: '6am',
    endTime: '8am',
    timeZone: 'EST',
    redirectLink: 'https://status.redhat.com/incidents',
    title: 'Maintenance in progress'
};

export default Maintenance;
