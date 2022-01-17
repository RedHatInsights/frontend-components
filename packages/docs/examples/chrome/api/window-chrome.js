import React from 'react';

const MyComponent = () => {
  const chrome = window.insights.chrome;
  const isBetaEnv = chrome.isBeta() ? 'foo' : 'bar';
  if (isBetaEnv) {
    console.log('Chrome in beta env');
  } else {
    console.log('Chrome in stable env');
  }
  return <div>...</div>;
};

export default MyComponent;
