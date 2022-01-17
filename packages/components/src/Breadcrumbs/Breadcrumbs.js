/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';

/**
 * @deprecated
 *
 * Breadcrumbs from FE component shouldn't be used anymore.
 *
 * Use <a href="https://www.patternfly.org/v4/components/breadcrumb" target="_blank">Breadcrumbs</a> from PF repository.
 */
const Breadcrumbs = ({ items, current, className, onNavigate, ...props }) => {
  console.warn(
    "Breadcrumbs from FE component shouldn't be used anymore. \
Instead use https://patternfly-react.surge.sh/documentation/react/components/breadcrumb from PF repository."
  );
  return (
    <Breadcrumb className={classnames('ins-c-breadcrumbs', className)} {...props}>
      {items.map((oneLink, key) => (
        <BreadcrumbItem key={key} data-key={key}>
          <a onClick={(event) => onNavigate(event, oneLink.navigate, key)} aria-label={oneLink.navigate}>
            {oneLink.title}
          </a>
        </BreadcrumbItem>
      ))}
      {current && <BreadcrumbItem isActive> {current} </BreadcrumbItem>}
    </Breadcrumb>
  );
};

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      navigate: PropTypes.any,
      title: PropTypes.node,
    })
  ),
  current: PropTypes.node,
  onNavigate: PropTypes.func,
};

Breadcrumbs.defaultProps = {
  items: [],
  current: null,
  onNavigate: Function.prototype,
  className: '',
};

export default Breadcrumbs;
