import React from 'react';
import { createRoot } from 'react-dom/client';
import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';

const MyCmp = () => {
  return (
    <PrimaryToolbar
      actionsConfig={{
        dropdownProps: { popperProps: { position: 'left' } },
        actions: [
          <Button
            key="Foo"
            data-hcc-index="true"
            data-hcc-title={'bar'}
            data-hcc-alt="create source;add cloud provider"
            variant="primary"
            id="addSourceButton"
          >
            FOO
          </Button>,
        ],
      }}
    />
  );
};

const element = document.querySelector('.demo-app');
if (element) {
  const root = createRoot(element);
  root.render(<MyCmp />);
}
