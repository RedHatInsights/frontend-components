import { Alert } from '@patternfly/react-core';
import React from 'react';

const DeprecationWarn = () => (
  <Alert className="pf-v5-u-mb-lg" isInline variant="warning" title="This component has been deprecated and is no longer supported." />
);

export default DeprecationWarn;
