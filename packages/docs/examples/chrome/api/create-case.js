import React from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const MyComponent = () => {
    const { createCase } = useChrome();
    const handleClick = () => {
        const options = {
            // custom object with no specified shape
            caseFields: {
                foo: 'bar'
            },
            // any additional data will be sent to sentry
            foo: 'nar'
        };
        createCase(options);
    };

    return (
        <button onClick={handleClick}>
          Open create dialong
        </button>
    );
};

export default MyComponent;
