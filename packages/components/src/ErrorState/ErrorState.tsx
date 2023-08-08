import React from 'react';
import { ExclamationCircleIcon } from '@patternfly/react-icons/';
import DefaultErrorMessage from './DefaultErrorMessage';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateProps,
  EmptyStateVariant,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import './error-state.scss';

export interface ErrorStateProps extends Omit<EmptyStateProps, 'children'> {
  errorTitle?: string;
  errorDescription?: React.ReactNode;
}

const ErrorState: React.FunctionComponent<ErrorStateProps> = ({ errorTitle = 'Something went wrong', errorDescription, ...props }) => {
  return (
    <EmptyState variant={EmptyStateVariant.lg} {...props} className="ins-c-error-state">
      <EmptyStateHeader titleText={<>{errorTitle}</>} icon={<EmptyStateIcon icon={ExclamationCircleIcon} />} headingLevel="h4" />
      <EmptyStateBody>
        <Stack>
          {!errorDescription && <StackItem>There was a problem processing the request. Please try again.</StackItem>}
          <StackItem>{errorDescription || <DefaultErrorMessage />}</StackItem>
        </Stack>
      </EmptyStateBody>
      <EmptyStateFooter>
        {document.referrer ? (
          <Button variant="primary" onClick={() => history.back()}>
            Return to last page
          </Button>
        ) : (
          <Button variant="primary" component="a" href="." target="_blank" rel="noopener noreferrer">
            Go to home page
          </Button>
        )}
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default ErrorState;
