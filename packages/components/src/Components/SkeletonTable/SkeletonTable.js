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
        const { paddingColumnSize } = this.props;
        const columns = this.props.columns || this.createColumns();
        return [ ...Array(paddingColumnSize) ].map(() => '').concat(columns);
    };

    createRows = () => {
        const { colSize, rowSize, columns, paddingColumnSize } = this.props;
        const numberOfCols = columns ? columns.length : colSize;
        return [
            ...Array(rowSize)
        ].map(() => [ ...Array(paddingColumnSize) ].map(() => '').concat(
            [ ...Array(numberOfCols) ].map(() => ({ title: <Skeleton size={ SkeletonSize.md } /> }))
        ));
    };

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
