import React, { useState } from 'react';
import propTypes from 'prop-types';
import get from 'lodash/get';
import { Button, DataList, Modal } from '@patternfly/react-core';
import { columnShape, isSelectedColumn } from './helpers';
import ListItem from './ListItem';
import ModalDescription from './ModalDescrption';
import { DEFAULT_MODAL_DESCRIPTION, DEFAULT_MODAL_TITLE } from './constants';

const ColumnManager = ({
  title = DEFAULT_MODAL_TITLE,
  description = DEFAULT_MODAL_DESCRIPTION,
  isOpen,
  columns,
  saveLabel = 'Save',
  onSave: onSaveArgument,
  closeLabel = 'Cancel',
  onClose: onCloseProp,
  selectAllLabel = 'Select All',
  selectedColumns: selectedColumnsProp = [],
  modalProps,
  selectProp = 'key',
}) => {
  const [selectedColumns, setSelectedColumns] = useState(selectedColumnsProp);

  const selectAllColumns = () => {
    setSelectedColumns(columns.map((column) => get(column, selectProp)));
  };

  const toggleColumn = (column) =>
    setSelectedColumns((selectedColumns) => {
      if (isSelectedColumn(selectedColumns, get(column, selectProp))) {
        return selectedColumns.filter((value) => value !== get(column, selectProp));
      } else {
        return [...selectedColumns, get(column, selectProp)];
      }
    });

  const onSave = () => onSaveArgument?.(selectedColumns);

  const onClose = () => {
    setSelectedColumns(selectedColumnsProp);
    onCloseProp?.();
  };

  return (
    <Modal
      title={title}
      isOpen={isOpen}
      variant="small"
      onClose={onClose}
      description={<ModalDescription description={description} selectAllColumns={selectAllColumns} selectAllLabel={selectAllLabel} />}
      actions={[
        <Button key="save" variant="primary" onClick={onSave}>
          {saveLabel}
        </Button>,
        <Button key="cancel" variant="secondary" onClick={onClose}>
          {closeLabel}
        </Button>,
      ]}
      {...modalProps}
    >
      <DataList aria-label="Table column management" id="table-column-management" isCompact>
        {columns.map((column, idx) => (
          <ListItem
            key={`column-${idx}`}
            id={`column-${idx}`}
            column={column}
            isSelected={isSelectedColumn(selectedColumns, get(column, selectProp))}
            onChange={() => toggleColumn(column)}
            isDisabled={idx === 0 || column.isRequired}
          />
        ))}
      </DataList>
    </Modal>
  );
};

ColumnManager.propTypes = {
  title: propTypes.string,
  description: propTypes.node,
  columns: propTypes.arrayOf(columnShape),
  selectedColumns: propTypes.array,
  isOpen: propTypes.bool,
  saveLabel: propTypes.node,
  onSave: propTypes.func,
  closeLabel: propTypes.node,
  onClose: propTypes.func,
  selectAllLabel: propTypes.node,
  modalProps: propTypes.object,
  selectProp: propTypes.string,
};

export default ColumnManager;
