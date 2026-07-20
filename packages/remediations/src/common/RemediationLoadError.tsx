import React, { useEffect } from 'react';

export interface RemediationLoadErrorProps {
  component?: string;
}

const RemediationLoadError = ({ component, ...props }: RemediationLoadErrorProps) => {
  useEffect(() => {
    console.error(`Unable to load remediations component. Failed to load ${component}.`, props);
  }, [component, props]);
  return (
    <div>
      <h1>Unable to load remediations component</h1>
      <h2>Failed to load {component}</h2>
      <code>More info can be found in browser console output.</code>
    </div>
  );
};

export default RemediationLoadError;
