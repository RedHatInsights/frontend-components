import React from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const MyComponent = () => {
  const chrome = useChrome();
  const isBetaEnv = chrome.isBeta() ? 'foo' : 'bar';
  if (isBetaEnv) {
    console.log('Chrome in beta env');
  } else {
    console.log('Chrome in stable env');
  }
  return <div>...</div>;
};

export default MyComponent;
