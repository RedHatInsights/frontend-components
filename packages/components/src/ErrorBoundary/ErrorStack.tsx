import * as React from 'react';
import { Text } from '@patternfly/react-core';

interface ErrorStackProps {
  error: Error;
}

const errorStackClass = 'ins-error-boundary-stack';

const ErrorStack: React.FunctionComponent<ErrorStackProps> = ({ error }) => {
  if (error.stack) {
    return (
      <Text className={errorStackClass}>
        {error.stack.split('\n').map((line) => (
          <div key={line}>{line}</div>
        ))}
      </Text>
    );
  }

  if (error.name && error.message) {
    return (
      <>
        <Text component="h6">{error.name}</Text>
        <Text className={errorStackClass} component="blockquote">
          {error.message}
        </Text>
      </>
    );
  }

  return (
    <Text className={errorStackClass} component="blockquote">
      {error.toString()}
    </Text>
  );
};

export default ErrorStack;
