import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './tagModal.scss';
import { Modal, Button, Tabs, Tab, TabTitleText } from '@patternfly/react-core';
import classNames from 'classnames';
import TableWithFilter from './TableWithFilter';

const calculateChecked = (rows = [], selected) =>
  rows.every(({ id }) => selected && selected.find(({ id: selectedId }) => selectedId === id))
    ? rows.length > 0
    : rows.some(({ id }) => selected && selected.find(({ id: selectedId }) => selectedId === id)) && null;

const unique = (arr) => arr.filter(({ id }, index, arr) => arr.findIndex(({ id: currId }) => currId === id) === index);

class TagModal extends Component {
  state = {
    selectedTab: 0,
  };

  handleTabClick = (_event, tabIndex) => {
    this.setState({ activeTabKey: tabIndex });
  };

  renderTable = (rows, columns, pagination, loaded, filters, selected, onSelect, onUpdateData, bulkSelect) => (
    <TableWithFilter
      {...this.props}
      rows={rows}
      pagination={pagination}
      loaded={loaded}
      calculateChecked={calculateChecked}
      unique={unique}
      filters={filters}
      title={this.props.title}
      systemName={this.props.systemName}
      columns={columns}
      onSelect={onSelect}
      onUpdateData={onUpdateData}
      selected={selected}
      bulkSelect={bulkSelect}
    >
      {this.props.children}
    </TableWithFilter>
  );

  render() {
    const {
      className,
      title,
      systemName,
      toggleModal,
      isOpen,
      rows,
      columns,
      children,
      pagination,
      loaded,
      filters,
      onApply,
      tabNames,
      onSelect,
      onUpdateData,
      selected,
      tableProps,
      bulkSelect,
      ...props
    } = this.props;

    const isTabbed = Array.isArray(tabNames);

    return (
      <Modal
        {...props}
        className={classNames('ins-c-tag-modal', className)}
        isOpen={isOpen}
        title={title || `Tags for ${systemName}`}
        onClose={(e) => toggleModal(e, false)}
        variant="medium"
        {...(onApply && {
          actions: [
            <Button
              key="confirm"
              variant="primary"
              isDisabled={
                isTabbed ? Object.values(selected || {}).every((values) => !values || values?.length === 0) : !selected || selected?.length === 0
              }
              onClick={(e) => {
                onApply();
                toggleModal(e, true);
              }}
            >
              Apply {isTabbed ? 'selected' : 'tags'}
            </Button>,
            <Button key="cancel" variant="link" onClick={(e) => toggleModal(e, false)}>
              Cancel
            </Button>,
          ],
        })}
      >
        {isTabbed ? (
          <Tabs activeKey={this.state.activeTabKey} onSelect={this.handleTabClick}>
            {tabNames.map((item, key) => (
              <Tab key={key} eventKey={key} title={<TabTitleText>All {item}</TabTitleText>}>
                {this.renderTable(
                  rows?.[key],
                  columns?.[key],
                  pagination?.[key],
                  loaded?.[key],
                  filters?.[key],
                  selected?.[key],
                  onSelect?.[key],
                  onUpdateData?.[key],
                  bulkSelect?.[key]
                )}
              </Tab>
            ))}
          </Tabs>
        ) : (
          this.renderTable(rows, columns, pagination, loaded, filters, selected, onSelect, onUpdateData, bulkSelect)
        )}
      </Modal>
    );
  }
}

TagModal.propTypes = {
  tabNames: PropTypes.arrayOf(PropTypes.string),
  loaded: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.bool)]),
  title: PropTypes.string,
  systemName: PropTypes.string,
  isOpen: PropTypes.bool,
  toggleModal: PropTypes.func,
  rows: PropTypes.array,
  columns: PropTypes.array,
  className: PropTypes.string,
  tableProps: PropTypes.shape({
    [PropTypes.string]: PropTypes.any,
  }),
  onSelect: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
  onUpdateData: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
  bulkSelect: PropTypes.oneOfType([PropTypes.any, PropTypes.arrayOf(PropTypes.any)]),
  pagination: PropTypes.oneOfType([TableWithFilter.propTypes.pagination, PropTypes.arrayOf(TableWithFilter.propTypes.pagination)]),
  primaryToolbarProps: PropTypes.shape({
    [PropTypes.string]: PropTypes.any,
  }),
  selected: PropTypes.array,
  children: PropTypes.node,
  filters: PropTypes.any,
  onApply: PropTypes.func,
};

TagModal.defaultProps = {
  loaded: false,
  isOpen: false,
  toggleModal: () => undefined,
  columns: [{ title: 'Name' }, { title: 'Tag source' }],
  onUpdateData: () => undefined,
  rows: [],
  tableProps: {},
  pagination: { count: 10 },
};

export default TagModal;
