import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableHeader, sortable } from '@patternfly/react-table';
import { Bullseye, EmptyState, EmptyStateIcon, Title, EmptyStateBody, EmptyStateVariant } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { Skeleton, TableToolbar, PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import flatten from 'lodash/flatten';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import { calculateMeta, calculateActiveFilters, createRows } from './helpers';
export { default as style } from './index.scss';

class RuleTable extends Component {
    state = {
        filterValues: {},
        expanded: []
    };

    debounceFetchData = debounce(options => {
        const { fetchData } = this.props;
        fetchData(options);
    }, 500);

    componentDidUpdate(prevProps) {
        if (!isEqual(prevProps.filterValues, this.props.filterValues)) {
            this.setState({
                filterValues: this.props.filterValues
            });
        }
    }

    componentDidMount() {
        this.setState({ filterValues: this.props.filterValues });
    }

    onUpdate = (isDebounce = false) => {
        const { fetchData, rules, columns, sortBy, detail } = this.props;
        const { filterValues } = this.state;
        const method = isDebounce ? this.debounceFetchData : fetchData;
        method({
            meta: calculateMeta(rules.meta),
            filterValues,
            sortBy: { ...sortBy, column: columns[sortBy.index - Boolean(detail)] }
        });
    };

    onFilterDelete = (_e, [ deleteItem ], isAll) => {
        const { filterValues } = this.state;
        if (isAll) {
            this.setState({ filterValues: {} }, () => this.onUpdate());
        } else {
            if (Array.isArray(filterValues[deleteItem.type])) {
                const activefilter = filterValues[deleteItem.type];
                const [ chipToDelete ] = deleteItem.chips;
                this.setState({ filterValues: {
                    ...filterValues,
                    [deleteItem.type]: activefilter.filter((item) => item !== chipToDelete.value)
                } }, () => this.onUpdate());
            } else {
                delete filterValues[deleteItem.type];
                this.setState({ filterValues }, () => this.onUpdate());
            }
        }
    };

    onCollapse = (_e, key, isOpen, { ruleId }) => {
        const { expanded } = this.state;
        const collapseKey = ruleId || (key / 2);
        if (isOpen) {
            this.setState({
                expanded: [
                    ...expanded,
                    collapseKey
                ]
            });
        } else {
            const currIndex = expanded.findIndex(id => id === collapseKey);
            expanded.splice(currIndex, 1);
            this.setState({ expanded });
        }
    };

    onFilterChange = (type, _e, value) => {
        this.setState({
            filterValues: {
                ...this.state.filterValues,
                [type]: value
            }
        }, () => this.onUpdate(true));
    };

    onSort = (_e, index, direction) => {
        const { fetchData, rules, columns, detail } = this.props;
        const { filterValues } = this.state;
        fetchData({
            meta: calculateMeta(rules.meta),
            filterValues,
            sortBy: { index, direction, column: columns[index - Boolean(detail)] }
        });
    };

    onPaginate = (perPage, page) => {
        const { fetchData, rules, columns, detail, sortBy } = this.props;
        const { filterValues } = this.state;
        fetchData({
            meta: { ...calculateMeta(rules.meta), perPage, page },
            filterValues,
            sortBy: { ...sortBy, column: columns[sortBy.index - Boolean(detail)] }
        });
    };

    render() {
        const {
            rules,
            filters,
            columns,
            detail,
            actions,
            ariaLabel,
            fetchData,
            isLoading,
            sortBy,
            toolbarProps,
            filterValues: _filterValues,
            loadingBars,
            emptyStateTitle,
            emptyStateDescription,
            emptyStateIcon,
            ...props
        } = this.props;
        const { expanded, filterValues } = this.state;
        const { meta, data } = rules;

        const defaultMeta = calculateMeta(meta);
        const pagination = {
            ...defaultMeta,
            onPerPageSelect: (_e, perPage) => this.onPaginate(perPage, 1),
            onSetPage: (_e, page) => this.onPaginate(defaultMeta.perPage, page)
        };
        const filterItems = Object.entries(filters).map(([ key, filter ]) => ({
            ...filter({
                onChange: (...props) => this.onFilterChange(key, ...props),
                value: filterValues[key],
                filterKey: key
            })
        }));

        return <section className="rhcs-c-rules-table">
            <PrimaryToolbar
                { ...filterItems && filterItems.length > 0 && { filterConfig: { items: filterItems } }}
                activeFiltersConfig={{
                    filters: Object.entries(filterValues).map(([ key, value ]) => calculateActiveFilters(
                        filterItems.find(({ filterKey }) => filterKey === key),
                        value,
                        key
                    )).filter(Boolean),
                    onDelete: this.onFilterDelete
                }}
                pagination={pagination}
                { ...toolbarProps }
            />
            <Table
                {...props}
                {...sortBy && { sortBy, onSort: this.onSort }}
                actions={!isLoading && actions}
                aria-label={ariaLabel}
                cells={columns.map(({ transforms, ...column }) => ({
                    ...column,
                    transforms: [
                        ...transforms || [],
                        ...!isLoading && sortBy && !column.disableSort ? [ sortable ] : []
                    ]
                }))}
                rows={
                    isLoading ?
                        [ ...new Array(loadingBars) ].map(() => ({
                            cells: [{
                                title: <Skeleton size="lg" />,
                                props: { colSpan: columns.length + Boolean(actions) }
                            }]
                        })) :
                        data.length > 0 ?
                            flatten(createRows(data, columns, expanded, detail)).filter(Boolean) :
                            [{
                                heightAuto: true,
                                cells: [
                                    {
                                        props: { colSpan: columns.length + Boolean(actions) },
                                        title: (
                                            <Bullseye>
                                                <EmptyState variant={EmptyStateVariant.small}>
                                                    <EmptyStateIcon icon={emptyStateIcon} />
                                                    <Title headingLevel="h2" size="lg">
                                                        {emptyStateTitle}
                                                    </Title>
                                                    <EmptyStateBody>
                                                        {emptyStateDescription}
                                                    </EmptyStateBody>
                                                </EmptyState>
                                            </Bullseye>
                                        )
                                    }
                                ]
                            }]
                }
                {...!isLoading && detail && data.length > 0 && { onCollapse: this.onCollapse } }
            >
                <TableHeader />
                <TableBody />
            </Table>
            <TableToolbar isFooter>
                <Pagination
                    {...pagination}
                    widgetId="pagination-options-menu-bottom"
                    variant={PaginationVariant.bottom}
                    dropDirection="up"
                />
            </TableToolbar>
        </section>;
    }
}

RuleTable.propTypes = {
    ariaLabel: PropTypes.string,
    rules: PropTypes.shape({
        meta: PropTypes.shape({
            count: PropTypes.number,
            offset: PropTypes.number,
            limit: PropTypes.offset
        }),
        data: PropTypes.arrayOf(PropTypes.shape({
            [PropTypes.string]: PropTypes.any
        }))
    }),
    isLoading: PropTypes.bool,
    columns: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.node,
        selector: PropTypes.oneOfType([ PropTypes.string, PropTypes.arrayOf(PropTypes.string), PropTypes.func ]),
        disableSort: PropTypes.bool
    })),
    sort: PropTypes.string,
    emptyStateTitle: PropTypes.string,
    emptyStateDescription: PropTypes.node,
    emptyStateIcon: PropTypes.node,
    defaultFilters: PropTypes.arrayOf(PropTypes.shape({})),
    fetchData: PropTypes.func,
    detail: PropTypes.oneOfType([ PropTypes.func, PropTypes.node ]),
    actions: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.node,
        onClick: PropTypes.func
    })),
    sortBy: PropTypes.shape({
        index: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        direction: PropTypes.string
    }),
    filterValues: PropTypes.shape({
        [PropTypes.string]: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])),
            PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
        ])
    }),
    toolbarProps: PropTypes.any,
    loadingBars: PropTypes.number
};

RuleTable.defaultProps = {
    rules: {
        data: []
    },
    columns: [],
    ariaLabel: 'Rules table',
    isLoading: false,
    sortBy: {},
    filters: {},
    filterValues: {},
    fetchData: () => undefined,
    loadingBars: 5,
    emptyStateTitle: 'No results found',
    emptyStateDescription: 'No results match the filter criteria. Remove all filters or clear all filters to show results.',
    emptyStateIcon: SearchIcon
};

export default RuleTable;
