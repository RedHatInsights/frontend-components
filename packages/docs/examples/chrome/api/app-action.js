import React from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const MyComponent = () => {
  const { appAction } = useChrome();
  const handleClick = () => {
    appAction('create-entity');
  };

  return <button onClick={handleClick}>Open create dialog</button>;
};

export default MyComponent;
