import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import useChrome from '../useChrome';
import { helpers } from '@redhat-cloud-services/frontend-components-utilities';
interface InsightsLinkProps {
  to: LinkProps['to'];
  app: string;
  preview: boolean;
}

const InsightsLink: React.FC<React.PropsWithChildren<InsightsLinkProps>> = ({ to, app, preview, ...props }) => {
  const chrome = useChrome();
  const toPath = helpers.buildInsightsPath(chrome, app, to, preview);

  return (
    <Link to={toPath} {...props}>
      {props.children}
    </Link>
  );
};

export default InsightsLink;
