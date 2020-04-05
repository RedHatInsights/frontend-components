import React from 'react';
import PropTypes from 'prop-types';
import './tagModal.scss';
import { Modal, Pagination } from '@patternfly/react-core';
import classNames from 'classnames';
import {
    Table,
    TableHeader,
    TableBody
} from '@patternfly/react-table';
import { TableToolbar } from '../TableToolbar';
import { PrimaryToolbar } from '../PrimaryToolbar';
import { Skeleton } from '../Skeleton';

const calculateChecked = (rows = [], selected) => (
    rows.every(({ id }) => selected && selected.find(({ id: selectedId }) => selectedId === id))
        ? rows.length > 0
        : rows.some(({ id }) => selected && selected.find(({ id: selectedId }) => selectedId === id)) && null
);

const unique = (arr) => {
    return arr.filter(({ id }, index, arr) => arr.findIndex(({ id: currId }) => currId === id) === index);
};

export default class TagModal extends React.Component {
    onSelect = (_event, isSelected, rowId) => {
        const { rows, onSelect, selected } = this.props;
        const currRow = rows[rowId];
        if (currRow) {
            onSelect(isSelected ? [ ...selected, currRow ] : selected.filter(({ id }) => id !== currRow.id));
        }
    }

    render() {
        const {
            className,
            systemName,
            toggleModal,
            isOpen,
            rows,
            columns,
            children,
            tableProps,
            pagination,
            onUpdateData,
            loaded,
            filters,
            onSelect,
            selected,
            ...props
        } = this.props;

        return (
            <Modal
                {...props}
                className={classNames('ins-c-tag-modal', className)}
                isOpen={isOpen}
                title={`Tags for ${systemName}`}
                onClose={toggleModal}
                isFooterLeftAligned
            >
                {onUpdateData && <PrimaryToolbar
                    {...onSelect && pagination && {
                        bulkSelect: {
                            count: selected.length,
                            onSelect: (isSelected) => {
                                if (isSelected) {
                                    onSelect(unique([ ...rows, ...selected ]));
                                } else {
                                    onSelect(selected.filter(({ id }) => !rows.find(({ id: rowId }) => rowId === id)));
                                }
                            },
                            checked: calculateChecked(rows, selected),
                            items: [{
                                title: 'Select none (0)',
                                onClick: () => onSelect([])
                            },
                            {
                                ...loaded && rows && rows.length > 0 ? {
                                    title: `Select page (${ rows.length })`,
                                    onClick: () => onSelect(unique([ ...rows, ...selected ]))
                                } : {}
                            }]
                        }
                    }}
                    {...filters && {
                        filterConfig: {
                            items: filters
                        }
                    } }
                    pagination={loaded ? {
                        ...pagination,
                        itemCount: pagination.count,
                        onSetPage: (_e, page) => this.updatePagination({ ...pagination, page }),
                        onPerPageSelect: (_e, perPage) => this.updatePagination({ ...pagination, page: 1, perPage })
                    } : <Skeleton size="lg" />}
                /> }
                {children}
                <Table
                    aria-label={`${systemName} tags`}
                    variant="compact"
                    className="ins-c-tag-modal__table"
                    cells={columns}
                    rows={rows}
                    {...onSelect && {
                        onSelect: this.onSelect
                    }}
                    { ...tableProps }
                >
                    <TableHeader />
                    <TableBody />
                </Table>
                {onUpdateData && pagination && <TableToolbar isFooter className="ins-c-inventory__table--toolbar">
                    <Pagination
                        itemCount={pagination.count}
                        perPage={pagination.perPage}
                        page={pagination.page}
                        variant="bottom"
                        onSetPage={(_event, page) => this.updatePagination({ ...pagination, page })}
                        onPerPageSelect={(_event, perPage) => this.updatePagination({ ...pagination, page: 1, perPage })}
                    />
                </TableToolbar> }
            </Modal>
        );
    }
}

TagModal.propTypes = {
    loaded: PropTypes.bool,
    systemName: PropTypes.string,
    isOpen: PropTypes.bool,
    toggleModal: PropTypes.func,
    rows: PropTypes.array,
    columns: PropTypes.array,
    className: PropTypes.string,
    tableProps: PropTypes.shape({
        [PropTypes.string]: PropTypes.any
    }),
    onSelect: PropTypes.func,
    onUpdateData: PropTypes.func,
    pagination: PropTypes.shape({
        count: PropTypes.number,
        page: PropTypes.number,
        perPage: PropTypes.number
    }),
    selected: PropTypes.array
};

TagModal.defaultProps = {
    loaded: true,
    isOpen: false,
    toggleModal: () => undefined,
    columns: [
        { title: 'Name' },
        { title: 'Tag Source' }
    ],
    rows: [],
    tableProps: {}
};
