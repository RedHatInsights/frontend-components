import React from 'react';
import classnames from 'classnames';
import { Breadcrumb, BreadcrumbItem as PFBreadcrumbItem, BreadcrumbProps } from '@patternfly/react-core';

export type BreadcrumbItem = {
  navigate: string;
  title: React.ReactNode;
};

export interface BreadcrumbsProps extends BreadcrumbProps {
  items?: BreadcrumbItem[];
  current?: React.ReactNode;
  onNavigate: (event: React.MouseEvent<HTMLAnchorElement>, link: string, key: number) => void;
}

/**
 * @deprecated
 *
 * Breadcrumbs from FE component shouldn't be used anymore.
 *
 * Use <a href="https://www.patternfly.org/v4/components/breadcrumb" target="_blank">Breadcrumbs</a> from PF repository.
 */
const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({
  items = [],
  current = null,
  className = '',
  onNavigate = () => undefined,
  ...props
}) => {
  console.warn(
    "Breadcrumbs from FE component shouldn't be used anymore. \
Instead use https://patternfly-react.surge.sh/documentation/react/components/breadcrumb from PF repository."
  );
  return (
    <Breadcrumb className={classnames('ins-c-breadcrumbs', className)} {...props}>
      {items.map((oneLink, key) => (
        <PFBreadcrumbItem key={key} data-key={key}>
          <a onClick={(event) => onNavigate(event, oneLink.navigate, key)} aria-label={oneLink.navigate}>
            {oneLink.title}
          </a>
        </PFBreadcrumbItem>
      ))}
      {current && <PFBreadcrumbItem isActive> {current} </PFBreadcrumbItem>}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
