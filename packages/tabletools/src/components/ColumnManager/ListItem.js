import React from 'react';
import propTypes from 'prop-types';
import { DataListCell, DataListCheck, DataListControl, DataListItem, DataListItemCells, DataListItemRow } from '@patternfly/react-core';

const ListItem = ({ column: { title }, onChange, isSelected, isDisabled, id, dataListCheckProps, dataListCellProps, children, ...props }) => (
  <DataListItem {...props}>
    <DataListItemRow>
      <DataListControl>
        <DataListCheck
          checked={isSelected}
          onChange={onChange}
          otherControls
          isDisabled={isDisabled}
          id={`${id}-id`}
          name={`${id}-id`}
          {...dataListCheckProps}
        />
      </DataListControl>
      <DataListItemCells
        dataListCells={[
          <DataListCell key={`${id}-cell`} {...dataListCellProps}>
            <label htmlFor={`${id}-id`}>{title}</label>
          </DataListCell>,
        ]}
      />
    </DataListItemRow>
    {children}
  </DataListItem>
);

ListItem.propTypes = {
  id: propTypes.string,
  column: propTypes.object,
  onChange: propTypes.func,
  isSelected: propTypes.bool,
  isDisabled: propTypes.bool,
  dataListCellProps: propTypes.object,
  dataListCheckProps: propTypes.object,
  children: propTypes.node,
};

export default ListItem;
