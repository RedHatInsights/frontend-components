import React from 'react';
import { Stack, StackItem } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/';
import DefaultErrorMessage from './DefaultErrorMessage';
import propTypes from 'prop-types';
import {
    Title,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    EmptyStateBody,
    Button
} from '@patternfly/react-core';

const ErrorState = ({ errorTitle, errorDescription, redirectLink }) => {

    return (
        <EmptyState variant={EmptyStateVariant.large}>
            <EmptyStateIcon icon={ExclamationCircleIcon} />
            <Title headingLevel='h4' size='lg'>
                {errorTitle}
            </Title>
            <EmptyStateBody>
                <Stack>
                    { !errorDescription && (
                            <StackItem>
                                There was a problem accessing the request. Please try again.
                            </StackItem>
                    )}
                    <StackItem>
                        { errorDescription || <DefaultErrorMessage />}
                    </StackItem>
                </Stack>
            </EmptyStateBody>
            {               
                document.referrer ? 
                    <Button variant="primary" onClick={ () => history.back() }>Return to Previous Page</Button> :
                    <Button variant="primary" component="a" href="." target="_blank" rel='noopener noreferrer'>Go to Home Page</Button>
            }
        </EmptyState>
    );
};

ErrorState.propTypes = {
    errorTitle: propTypes.string,
    errorDescription: propTypes.string, 
    redirectLink: propTypes.string
};

ErrorState.defaultProps = {
    errorTitle: 'Something went wrong',
    redirectLink: 'https://access.redhat.com/support?extIdCarryOver=true&sc_cid=701f2000001Css0AAC'
};

export default ErrorState;
