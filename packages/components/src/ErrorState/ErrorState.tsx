import React from 'react';
import { ExclamationCircleIcon } from '@patternfly/react-icons/';
import DefaultErrorMessage from './DefaultErrorMessage';
import propTypes from 'prop-types';
import {
  Title,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  Button,
  EmptyStateProps,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import './error-state.scss';

const ErrorState = (errorTitle: string, errorDescription: string, ...props: EmptyStateProps[]) => {
  return (
    <EmptyState variant={EmptyStateVariant.large} {...props} className="ins-c-error-state">
      <EmptyStateIcon icon={ExclamationCircleIcon} />
      <Title headingLevel="h4" size="lg">
        {errorTitle}
      </Title>
      <EmptyStateBody>
        <Stack>
          {!errorDescription && <StackItem>There was a problem processing the request. Please try again.</StackItem>}
          <StackItem>{errorDescription || <DefaultErrorMessage />}</StackItem>
        </Stack>
      </EmptyStateBody>
      {document.referrer ? (
        <Button variant="primary" onClick={() => history.back()}>
          Return to last page
        </Button>
      ) : (
        <Button variant="primary" component="a" href="." target="_blank" rel="noopener noreferrer">
          Go to home page
        </Button>
      )}
    </EmptyState>
  );
};

ErrorState.propTypes = {
  errorTitle: propTypes.string,
  errorDescription: propTypes.string,
};

ErrorState.defaultProps = {
  errorTitle: 'Something went wrong',
};

export default ErrorState;
