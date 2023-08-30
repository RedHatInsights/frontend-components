import React from 'react';
import { createRoot } from 'react-dom/client';
import AppEntry from './AppEntry';

const root = document.getElementById('root');
if (root) {
  const reactRoot = createRoot(root);
  reactRoot.render(<AppEntry />);
}
