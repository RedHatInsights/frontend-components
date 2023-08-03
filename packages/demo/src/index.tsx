import React from 'react';
import { createRoot } from 'react-dom/client';
import { TableVariant } from '@patternfly/react-table';
import SkeletonTable from '@redhat-cloud-services/frontend-components/SkeletonTable';
import BulkSelect from '@redhat-cloud-services/frontend-components/BulkSelect';
import SimpleTableFilter from '@redhat-cloud-services/frontend-components/SimpleTableFilter';
import ConditionalFilter, { ConditionalFilterProps, GroupType, TextFilter } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { Button, DropdownItem } from '@patternfly/react-core';
import DownloadButton from '@redhat-cloud-services/frontend-components/DownloadButton';
import ErrorBoundaryPage from '@redhat-cloud-services/frontend-components/ErrorBoundary/ErrorBoundary';

const Surprise = () => {
  throw new Error('but a welcome one');
};
const extraItems = [<DropdownItem key="extra-1" component="button"></DropdownItem>];
const MyCmp = () => {
  return (
    <ErrorBoundaryPage headerTitle="My app" errorTitle="Something wrong happened">
      <Surprise />
    </ErrorBoundaryPage>
  );
};

const element = document.querySelector('.demo-app');
if (element) {
  const root = createRoot(element);
  root.render(<MyCmp />);
}
