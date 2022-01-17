import React from 'react';
import { Button } from '@patternfly/react-core';
import { AngleRightIcon } from '@patternfly/react-icons';
import './styles.scss';

export default (onCollapse) =>
  (value = '', { rowData, ...props } = { rowData: {} }) => ({
    value,
    children:
      rowData.level !== undefined ? (
        <div className="pf-c-treeview__control">
          {rowData.isTreeOpen !== undefined && (
            <div className="pf-c-treeview__toggle">
              <Button variant="plain" onClick={(event) => onCollapse && onCollapse(event, value, { rowData, ...props })}>
                <AngleRightIcon className="pf-c-treeview__toggle-icon" aria-hidden="true" />
              </Button>
            </div>
          )}
          <div className="pf-c-treeview__control-text">{value.title || value}</div>
        </div>
      ) : (
        value.title || value
      ),
    className: rowData.level !== undefined ? 'pf-c-treeview__title-cell' : '',
  });
