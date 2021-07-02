import React from 'react';

const MyComponent = () => {
    const chrome = window.insights.chrome;
    const x = chrome.isBeta() ? 'foo' : 'bar';
    return (
        <div>
          ...
        </div>
    );
};

export default MyComponent;
