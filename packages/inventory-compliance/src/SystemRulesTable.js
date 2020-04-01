import React from 'react';
import propTypes from 'prop-types';
import { Pagination, PaginationVariant, DataToolbarItem } from '@patternfly/react-core';
import { CheckIcon, CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { TableToolbar, PrimaryToolbar } from '@redhat-cloud-services/frontend-components';

import './compliance.scss';
import { RuleChildRow, RuleTitle, RuleLoadingTable, EmptyRows } from './PresentationalComponents';
import {
    FilterConfigBuilder, stringToId, buildFilterConfig, POLICIES_FILTER_CONFIG,
    toRulesArray, orderByArray, orderRuleArrayByProp
} from './Utilities';
import { HIGH_SEVERITY, MEDIUM_SEVERITY, LOW_SEVERITY } from './Constants';
import ComplianceRemediationButton from './ComplianceRemediationButton';

class SystemRulesTable extends React.Component {
    config = buildFilterConfig({
        selectedFilter: this.props.selectedFilter,
        showPassFailFilter: (this.props.columns.filter((c) => (c.title === 'Passed')).length > 0),
        policies: this.props.profileRules.map((p) => (p.profile))
    });
    filterConfigBuilder = new FilterConfigBuilder(this.config);
    chipBuilder = this.filterConfigBuilder.getChipBuilder();
    filterBuilder = this.filterConfigBuilder.getFilterBuilder();

    state = {
        page: 1,
        itemsPerPage: 10,
        rows: [],
        sortBy: {},
        rules: toRulesArray(this.props.profileRules, this.props.selectedRefIds),
        ruleCount: 0,
        filterConfigBuilder: null,
        filterChips: [],
        activeFilters: this.filterConfigBuilder.initialDefaultState({
            selected: this.props.selectedFilter ? [ 'selected' ] : undefined,
            passed: this.props.hidePassed ? [ 'failed' ] : undefined
        })
    };

    updatePolicyFilterConfig = (policies) => {
        if (policies.length > 1) {
            this.filterConfigBuilder.addConfigItem(POLICIES_FILTER_CONFIG(policies));
        }
    }

    parentRowForRule = (rule) => {
        const {
            title, identifier, policies, severity, compliant,
            remediationAvailable, refId, isOpen, isSelected
        } = rule;
        const cells = this.props.columns.map((column) => {
            let cell;

            switch (column.original || column.title) {
                case 'Rule':
                    cell = <RuleTitle title={ title } identifier={ identifier } />;
                    break;
                case 'Policy':
                    cell = policies.map((p) => p.name).slice(0, 1).join(', ');
                    break;
                case 'Severity':
                    cell = (severity.toLowerCase() === 'high' ? HIGH_SEVERITY :
                        severity.toLowerCase() === 'medium' ? MEDIUM_SEVERITY :
                            severity.toLowerCase() === 'low' ? LOW_SEVERITY : severity);
                    break;
                case 'Passed':
                    cell = (compliant ? <CheckCircleIcon className='ins-u-passed' /> :
                        <ExclamationCircleIcon className='ins-u-failed' />);
                    break;
                case 'Ansible':
                    cell = (remediationAvailable ?
                        <CheckIcon className='ins-c-compliance-system-rule-check' /> : 'No');
                    break;
            }

            return cell ? {
                title: cell
            } : null;
        });

        return {
            parentOf: refId,
            selected: isSelected,
            isOpen,
            cells
        };
    }

    childRowForRule = (rule, idx) => ({
        childOf: rule.refId,
        parent: idx,
        cells: [
            { title: <RuleChildRow rule={ rule } key={ 'rule-' + rule.refId } /> }
        ]
    })

    rulesToRows = (rules) => (
        rules.flatMap((rule, idx) => ([
            this.parentRowForRule(rule),
            this.childRowForRule(rule, (((idx + 1) * 2) - 2))
        ]))
    )

    paginatedRules = (rules) => (
        rules.slice(
            (this.state.page - 1) * this.state.itemsPerPage,
            this.state.page * this.state.itemsPerPage
        )
    )

    componentDidMount = () => (
        this.updateTable()
    )

    componentDidUpdate = (prevProps) => {
        if (this.props.profileRules !== prevProps.profileRules) {
            this.updatePolicyFilterConfig(this.props.profileRules.map((p) => (
                p.profile
            )).filter((p) => !!p));
            this.setState({
                rules: toRulesArray(this.props.profileRules)
            }, this.updateTable);
        }
    }

    updateChips = () => (
        this.chipBuilder.chipsFor(this.state.activeFilters).then((filterChips) => (
            this.setState({
                filterChips
            })
        ))
    )

    updateRows = () => {
        const rules = this.filteredRules();

        this.setState({
            ruleCount: rules.length,
            rows: this.rulesToRows(this.paginatedRules(rules))
        });
    }

    updateTable = () => {
        this.updateChips();
        this.updateRows();
    }

    filteredRules = () => (
        this.filterConfigBuilder.applyFilterToObjectArray(
            this.state.rules, this.state.activeFilters
        )
    )

    removeFilterFromFilterState = (currentState, filter) => (
        (typeof(currentState) === 'string') ? '' :
            currentState.filter((value) =>
                value !== filter
            )
    )

    onFilterUpdate = (filter, values) => (
        this.setState({
            page: 1,
            activeFilters: {
                ...this.state.activeFilters,
                [filter]: values
            }
        }, this.updateTable)
    )

    deleteFilter = (chips) => {
        const chipCategory = chips.category;
        const chipValue = this.filterConfigBuilder.valueForLabel(chips.chips[0].name, chipCategory);
        const stateProp = stringToId(chipCategory);
        const currentState = this.state.activeFilters[stateProp];
        const newFilterState = this.removeFilterFromFilterState(currentState, chipValue);
        const activeFilters =  {
            ...this.state.activeFilters,
            [stateProp]: newFilterState
        };

        this.setState({
            activeFilters
        }, this.updateTable);
    }

    clearAllFilter = () => (
        this.setState({
            activeFilters: this.filterConfigBuilder.initialDefaultState(),
            filterChips: []
        }, this.updateTable)
    )

    onFilterDelete = (_event, chips, clearAll = false) => (
        clearAll ? this.clearAllFilter() : this.deleteFilter(chips[0])
    )

    changePage = (page, itemsPerPage) => (
        this.setState({
            page,
            itemsPerPage
        }, this.updateTable)
    )

    setPage = (_, page) => (
        this.changePage(page, this.state.itemsPerPage)
    )

    setPerPage = (_, itemsPerPage) => (
        this.changePage(1, itemsPerPage)
    )

    selectAllCheckbox = (key) => (key === -1)

    onSelect = (_, selected, key, rowData) => {
        const { rules } = this.state;
        const { handleSelect } = this.props;
        let selectedRuleIds = [];
        let filter;

        if (this.selectAllCheckbox(key)) {
            filter = () => (true);
        } else {
            filter = (rule) => (rule.refId === rowData.parentOf);
        }

        const selectedRules = rules.map((rule) => {
            if (filter(rule)) {
                if (selected) {
                    selectedRuleIds.push(rule.refId);
                }

                return { ...rule, isSelected: selected };
            } else {
                return rule;
            }
        });

        this.setState({
            rules: selectedRules
        }, () => {
            this.updateTable();
            handleSelect(selectedRuleIds);
        });
    }

    onCollapse = (_e, _k, isOpen, cell) => (
        this.setState({
            rules: this.state.rules.map((rule) =>
                (rule.refId === cell.parentOf ? {
                    ...rule, isOpen: isOpen
                } : rule)
            )
        }, this.updateTable)
    )

    selectedRules = () => (
        this.state.rules.filter((rule) => (rule.isSelected))
    )

    defaultSorting = (...args) => (
        orderRuleArrayByProp(...args)
    )

    severitySorting = (property, rules, direction) => (
        orderByArray(rules, property, [ 'high', 'medium', 'low', 'unkown' ], direction)
    )

    getSorter = (property) => {
        switch (property) {
            case 'severity':
                return this.severitySorting;
            default:
                return this.defaultSorting;
        }
    }

    onSort = (_, index, direction, extraData) => {
        const property = extraData.property;
        const sorter = this.getSorter(property);
        const rules = sorter(property, this.state.rules, direction);

        this.setState({
            sortBy: {
                index,
                direction
            },
            rules
        }, this.updateTable);
    }

    render() {
        const {
            sortBy, page, itemsPerPage, filterChips, rows, ruleCount
        } = this.state;
        const { remediationsEnabled, system, loading, columns } = this.props;
        const pagination = {
            itemCount: ruleCount,
            page,
            perPage: itemsPerPage,
            onSetPage: this.setPage,
            onPerPageSelect: this.setPerPage
        };
        const selectedRulesWithRemediations = this.selectedRules().filter(
            (rule) => (rule.remediationAvailable)
        );
        const filterConfig = this.filterConfigBuilder.buildConfiguration(
            this.onFilterUpdate,
            this.state.activeFilters,
            { hideLabel: true }
        );

        if (loading) {
            return <RuleLoadingTable columns={columns} />;
        } else {
            return <React.Fragment>
                <PrimaryToolbar
                    filterConfig={ filterConfig }
                    activeFiltersConfig={{
                        filters: filterChips,
                        onDelete: this.onFilterDelete
                    }}
                    pagination={{
                        ...pagination,
                        dropDirection: 'down'
                    }}>
                    { remediationsEnabled &&
                        <DataToolbarItem>
                            <ComplianceRemediationButton
                                allSystems={ [{ id: system.id, ruleObjectsFailed: [] }] }
                                selectedRules={ selectedRulesWithRemediations } />
                        </DataToolbarItem>
                    }
                    <DataToolbarItem>
                        { ruleCount } results
                    </DataToolbarItem>
                </PrimaryToolbar>
                <Table
                    className='compliance-rules-table'
                    aria-label='Rules table'
                    cells={ columns }
                    onCollapse={ this.onCollapse }
                    onSort={ this.onSort }
                    sortBy={ sortBy }
                    onSelect={ (ruleCount === 0) ? undefined : this.onSelect }
                    rows={ (ruleCount === 0) ? EmptyRows : rows }>
                    <TableHeader />
                    <TableBody />
                </Table>
                <TableToolbar isFooter className="ins-c-inventory__table--toolbar">
                    <Pagination
                        { ...pagination}
                        dropDirection='up'
                        variant={ PaginationVariant.bottom }
                    />
                </TableToolbar>
            </React.Fragment>;
        }
    }
}

SystemRulesTable.propTypes = {
    profileRules: propTypes.array,
    loading: propTypes.bool,
    hidePassed: propTypes.bool,
    system: propTypes.object,
    remediationsEnabled: propTypes.bool,
    tailoringEnabled: propTypes.bool,
    selectedRefIds: propTypes.array,
    selectedFilter: propTypes.bool,
    handleSelect: propTypes.func,
    columns: propTypes.arrayOf(
        propTypes.shape(
            {
                title: propTypes.oneOfType([ propTypes.string, propTypes.object ]).isRequired,
                transforms: propTypes.array.isRequired,
                original: propTypes.string
            }
        )
    )
};

SystemRulesTable.defaultProps = {
    profileRules: [{ rules: [] }],
    hidePassed: false,
    selectedFilter: false,
    remediationsEnabled: true,
    tailoringEnabled: false,
    selectedRefIds: [],
    handleSelect: (() => {})
};

export default SystemRulesTable;
