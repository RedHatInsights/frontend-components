import React from 'react';
import ContentLoader, { IContentLoaderProps } from 'react-content-loader';

const RowLoader = (props: IContentLoaderProps) => (
  <ContentLoader height={20} width={480} {...props}>
    <rect x="30" y="0" rx="3" ry="3" width="250" height="7" />
    <rect x="300" y="0" rx="3" ry="3" width="70" height="7" />
    <rect x="385" y="0" rx="3" ry="3" width="95" height="7" />
    <rect x="50" y="12" rx="3" ry="3" width="80" height="7" />
    <rect x="150" y="12" rx="3" ry="3" width="200" height="7" />
    <rect x="360" y="12" rx="3" ry="3" width="120" height="7" />
    <rect x="0" y="0" rx="0" ry="0" width="20" height="20" />
  </ContentLoader>
);

export default RowLoader;
