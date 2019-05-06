import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import { Table, TableHeader, TableBody, TableVariant, SortByDirection } from '@patternfly/react-table';
import flatMap from 'lodash/flatMap';

class InfoTable extends Component {
    state = {
        sortBy: { index: 0, direction: SortByDirection.asc },
        opened: []
    };

    onSort = (event, index, direction) => {
        const { expandable } = this.props;
        this.props.onSort(event, expandable ? index - 1 : index, direction);
        this.setState({
            sortBy: {
                index,
                direction
            }
        });
    }

    onCollapse = (_event, index, isOpen) => {
        const { opened } = this.state;
        opened[index] = isOpen;
        this.setState({
            opened
        });
    }

    render() {
        const { cells, rows, expandable } = this.props;
        const { sortBy, opened } = this.state;
        const collapsibleProps = expandable ? {
            onCollapse: this.onCollapse
        } : {};
        const mappedRows = expandable ? flatMap(rows, ({ child, ...row }, key) => [
            {
                ...row,
                isOpen: opened[key * 2] || false
            },
            {
                cells: [{ title: child }],
                parent: key * 2
            }
        ]) : rows;
        return (
            <Fragment>
                {
                    cells.length !== 1 ? <Table
                        aria-label="General information dialog table"
                        variant={ TableVariant.compact }
                        cells={ cells }
                        rows={ mappedRows }
                        sortBy={ {
                            ...sortBy,
                            index: expandable && sortBy.index === 0 ? 1 : sortBy.index
                        } }
                        onSort={ this.onSort }
                        { ...collapsibleProps }
                    >
                        <TableHeader />
                        <TableBody />
                    </Table> :
                        <TextContent>
                            { rows.map((row, key) => (
                                <Text component={ TextVariants.small } key={ key }>
                                    { row.title || row }
                                </Text>
                            )) }
                        </TextContent>
                }
            </Fragment>

        );
    }
}

InfoTable.propTypes = {
    rows: PropTypes.array,
    cells: PropTypes.array,
    onSort: PropTypes.func
};
InfoTable.defaultProps = {
    cells: [],
    rows: [],
    onSort: () => undefined,
    sortBy: {}
};

export default InfoTable;
