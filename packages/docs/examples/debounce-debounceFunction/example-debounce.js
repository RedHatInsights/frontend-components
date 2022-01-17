import React, { useState } from 'react';

import debouce from '@redhat-cloud-services/frontend-components-utilities/debounce';

const AsyncFunction = (callback) => {
  callback();
  return Promise.resolve({ response: 'foo' });
};

const debouncedAsyncFunction = debouce(AsyncFunction);

const DemostrateDebounce = () => {
  const [triggerCounter, setTriggerCounter] = useState(0);
  const [clickCounter, setClickCounter] = useState(0);
  return (
    <div>
      <p>By default the debounced function will be called 800ms after last trigger</p>
      <div>
        <button
          onClick={() => {
            setClickCounter((prev) => prev + 1);
            debouncedAsyncFunction(() => setTriggerCounter((prev) => prev + 1));
          }}
        >
          Click quickly to call debounced function
        </button>
      </div>
      <br />
      <p>Number of button clicks: {clickCounter}</p>
      <p>Number of async function triggers: {triggerCounter}</p>
    </div>
  );
};

export default DemostrateDebounce;
