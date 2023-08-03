import React from 'react';
import { createRoot } from 'react-dom/client';
import { TableVariant } from '@patternfly/react-table';
import SkeletonTable from '@redhat-cloud-services/frontend-components/SkeletonTable';

const MyCmp = () => {
  return <SkeletonTable variant={TableVariant.compact} numberOfColumns={10} columns={['Foo', 'Bar', 'zaz']} />;
};

const element = document.querySelector('.demo-app');
if (element) {
  const root = createRoot(element);
  root.render(<MyCmp />);
}
