import React from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const MyComponent = () => {
    const chrome = useChrome();
    const x = chrome.isBeta() ? 'foo' : 'bar';
    return (
        <div>
          ...
        </div>
    );
};

export default MyComponent;
