/* eslint-disable react/display-name */
import React from 'react';
import { Button } from '@patternfly/react-core';
import { AngleRightIcon } from '@patternfly/react-icons';
import './styles.scss';
import { TreeTableRowProps } from '.';

export type TreeTableDecoratorCollapse = (event: React.MouseEvent<HTMLButtonElement>, value: any, row: TreeTableRowProps) => void;

const treeTableDecorator =
  (onCollapse: TreeTableDecoratorCollapse) =>
  (value: { title: React.ReactNode } | string = '', { rowData, ...props }: TreeTableRowProps = { rowData: {} }) => ({
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
          <div className="pf-c-treeview__control-text">{typeof value === 'object' ? value.title : value}</div>
        </div>
      ) : typeof value === 'object' ? (
        value.title
      ) : (
        value
      ),
    className: rowData.level !== undefined ? 'pf-c-treeview__title-cell' : '',
  });

export default treeTableDecorator;
