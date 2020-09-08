import React from 'react';
import { Stack, StackItem } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/';
import propTypes from 'prop-types';
import './ErrorState.styles.scss';

import {
    Title,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    EmptyStateBody,
    Button
} from '@patternfly/react-core';

const ErrorState = ({ errorTitle, errorDescription }) => {

    const renderDescription = () => {
        console.log('This is our error description: ', errorDescription);

        if (errorDescription.length > 0) {
            console.log('Rendering a description: ');

            return (
                <Stack>
                    <StackItem>
                        {errorDescription}
                    </StackItem>
                </Stack>
            );
        }

        return (
            <Stack>
                <StackItem>
                    There was a problem accessing the request. Please try again.
                </StackItem>
                <StackItem>
                    If the problem persists, contact <a href="https://access.redhat.com/support?extIdCarryOver=true&sc_cid=701f2000001Css0AAC">
                    Red Hat Supprt</a> or check out our <a href="status.redhat.com"> status page</a> for known outages.
                </StackItem>
            </Stack>
        );
    };

    return (
        <EmptyState variant={EmptyStateVariant.large}>
            <EmptyStateIcon icon={ExclamationCircleIcon} />
            <Title headingLevel='h4' size='lg'>
                {errorTitle}
            </Title>
            <EmptyStateBody>
                <>
                    {renderDescription()}
                </>
            </EmptyStateBody>
            {               
                document.referrer ? 
                    <Button variant="primary" onClick={ () => history.back() }>Return to Previous Page</Button> :
                    <Button variant="primary" component="a" href=".">Go to Home Page</Button>
            }
        </EmptyState>
    );
};

ErrorState.propTypes = {
    errorTitle: propTypes.string,
    errorDescription: propTypes.string
};

ErrorState.defaultProps = {
    errorTitle: 'Something went wrong',
    errorDescription: 'There was a problem accessing the request. Please try again.'
};

export default ErrorState;
