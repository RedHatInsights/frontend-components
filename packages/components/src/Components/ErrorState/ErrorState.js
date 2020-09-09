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

const ErrorState = ({ errorTitle, errorDescription, ...props }) => {

    return (
        <EmptyState variant={EmptyStateVariant.large} {...props}>
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
    errorDescription: propTypes.string
};

ErrorState.defaultProps = {
    errorTitle: 'Something went wrong'
};

export default ErrorState;
