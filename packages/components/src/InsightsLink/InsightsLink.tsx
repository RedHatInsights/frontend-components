import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import useChrome from '../useChrome';
import { buildInsightsPath } from '@redhat-cloud-services/frontend-components-utilities/helpers/urlPathHelpers';
interface InsightsLinkProps {
  to: LinkProps['to'];
  app: string;
  preview: boolean;
}

const InsightsLink = ({ to, app, preview, ...props }: React.PropsWithChildren<InsightsLinkProps>) => {
  const chrome = useChrome();
  const toPath = buildInsightsPath(chrome, app, to, preview);

  return (
    <Link to={toPath} {...props}>
      {props.children}
    </Link>
  );
};

export default InsightsLink;
