import React from 'react';
import { createRoot } from 'react-dom/client';
import ErrorBoundaryPage from '@redhat-cloud-services/frontend-components/ErrorBoundary/ErrorBoundary';

const Surprise = () => {
  throw new Error('but a welcome one');
};

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
