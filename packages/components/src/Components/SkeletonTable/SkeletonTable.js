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
    }

    createRows = () => {
        const { colSize, rowSize, columns } = this.props;
        const numberOfCols = columns ? columns.length : colSize;
        return [
            ...Array(rowSize)
        ].map(() => [ ...Array(numberOfCols) ].map(() => ({ title: <Skeleton size={ SkeletonSize.md } /> })));
    }

    render() {
        return (
            <Table cells={ this.props.columns || this.createColumns() } rows={ this.createRows() } aria-label="Loading">
                <TableHeader />
                <TableBody />
            </Table>
        );
    }
}

SkeletonTable.propTypes = {
    colSize: PropTypes.number,
    rowSize: PropTypes.number,
    columns: PropTypes.array
};

SkeletonTable.defaultProps = {
    rowSize: 0
};

export default SkeletonTable;
