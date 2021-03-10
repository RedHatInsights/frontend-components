import React from 'react';
import { RowSelectVariant, Table, TableHeader, TableBody } from '@patternfly/react-table';
import { Skeleton, SkeletonSize } from '../Skeleton';
import PropTypes from 'prop-types';

class SkeletonTable extends React.Component {
    createColumns = () => {
        const { colSize } = this.props;
        return [
            ...Array(colSize)
        ].map(() => ({ title: <Skeleton size={ SkeletonSize.sm } /> }));
    };

    getColumns = () => {
        const { paddingColumnSize, columns } = this.props;
        return this.newArray(paddingColumnSize).map(() => '').concat(columns || this.createColumns());
    };

    createRows = () => {
        const { colSize, rowSize, columns, paddingColumnSize } = this.props;
        const numberOfCols = columns ? columns.length : colSize;
        return this.newArray(rowSize).map(() => ({ disableSelection: true, cells: this.newArray(paddingColumnSize).map(() => '').concat(
            this.newArray(numberOfCols).map(() => ({ title: <Skeleton size={ SkeletonSize.md } /> }))
        ) }));
    };

    selectVariant = () => {
        const { hasRadio } = this.props;

        return hasRadio ? (RowSelectVariant?.radio || 'radio') : (RowSelectVariant?.checkbox || 'checkbox');
    };

    newArray = (size) => [ ...Array(size) ];

    render() {
        const { canSelectAll, isSelectable, sortBy, variant } = this.props;
        return (
            <Table cells={ this.getColumns() }
                rows={ this.createRows() }
                sortBy={ sortBy }
                aria-label="Loading"
                onSelect={ isSelectable }
                selectVariant={ isSelectable ? this.selectVariant() : null }
                canSelectAll={ canSelectAll }
                variant={ variant }>
                <TableHeader />
                <TableBody />
            </Table>
        );
    }
}

SkeletonTable.propTypes = {
    colSize: PropTypes.number,
    rowSize: PropTypes.number,
    columns: PropTypes.array,
    paddingColumnSize: PropTypes.number,
    sortBy: PropTypes.shape({
        index: PropTypes.number,
        direction: PropTypes.oneOf([ 'asc', 'desc' ])
    }),
    isSelectable: PropTypes.bool,
    canSelectAll: PropTypes.bool,
    hasRadio: PropTypes.bool,
    variant: PropTypes.string
};

SkeletonTable.defaultProps = {
    rowSize: 0,
    paddingColumnSize: 0,
    canSelectAll: false,
    isSelectable: false,
    hasRadio: false,
    variant: null
};

export default SkeletonTable;
