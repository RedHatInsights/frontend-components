import React from 'react';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
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
        return this.newArray(rowSize).map(() => this.newArray(paddingColumnSize).map(() => '').concat(
            this.newArray(numberOfCols).map(() => ({ title: <Skeleton size={ SkeletonSize.md } /> }))
        ));
    };

    newArray = (size) => [ ...Array(size) ];

    render() {
        return (
            <Table cells={ this.getColumns() }
                rows={ this.createRows() }
                sortBy={ this.props.sortBy }
                aria-label="Loading">
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
    })
};

SkeletonTable.defaultProps = {
    rowSize: 0,
    paddingColumnSize: 0
};

export default SkeletonTable;
