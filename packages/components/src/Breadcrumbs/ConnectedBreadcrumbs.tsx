/* eslint-disable react/prop-types */
import React from 'react';
import { useEffect } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import Breadcrumbs, { BreadcrumbItem, BreadcrumbsProps } from './Breadcrumbs';

export interface ConnectedBreadcrumbsProps extends BreadcrumbsProps {
  mappings?: { [key: string]: string };
}

/**
 * @deprecated
 *
 * Breadcrumbs from FE component shouldn't be used anymore.
 *
 * Use <a href="https://www.patternfly.org/v4/components/breadcrumb" target="_blank">Breadcrumbs</a> from PF repository.
 */
const ConnectedBreadcrumbs: React.FunctionComponent<ConnectedBreadcrumbsProps> = (props) => {
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
  useEffect(() => {
    console.warn('This component will be removed in future release (next month March), do not use it anymore!');
  }, []);

  const onNavigate = (_event: React.MouseEvent, _item: string, key: number) => {
    history.go(-key);
  };

  const calculateBreadcrumbs = (): (string | React.ReactNode)[] => {
    const { current, mappings } = props;
    if (!current && mappings) {
      const root = match.path.split('/').slice(2);
      const rest = location.pathname.substring(match.path.length).split('/').slice(1);
      return [...root, ...rest.map((item, key) => mappings[key] || item)];
    } else {
      return [...location.pathname.split('/').slice(2, -1), current];
    }
  };

  const mappedBreadcrumbs = calculateBreadcrumbs() || [];
  return (
    <Breadcrumbs
      {...props}
      items={mappedBreadcrumbs.slice(0, -1).map((item) => ({ title: item, navigate: item } as unknown as BreadcrumbItem))}
      onNavigate={onNavigate}
      current={mappedBreadcrumbs.slice(-1)[0]}
    />
  );
};

export default ConnectedBreadcrumbs;
