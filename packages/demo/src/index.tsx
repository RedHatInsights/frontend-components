import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { DownloadButton } from '@redhat-cloud-services/frontend-components/DownloadButton';

const MyCmp = () => {
  const [selected, setSelected] = useState<string | undefined>();
  return <DownloadButton />;
};

const element = document.querySelector('.demo-app');
if (element) {
  const root = createRoot(element);
  root.render(<MyCmp />);
}
