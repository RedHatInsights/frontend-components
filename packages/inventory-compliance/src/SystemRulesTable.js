import React from 'react';
import propTypes from 'prop-types';
import { Pagination, PaginationVariant, DataToolbarItem } from '@patternfly/react-core';
import { CheckIcon, CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { Table, TableHeader, TableBody, SortByDirection } from '@patternfly/react-table';
import { TableToolbar, PrimaryToolbar } from '@redhat-cloud-services/frontend-components';

import './compliance.scss';
import { RuleChildRow, RuleTitle, RuleLoadingTable, EmptyRows } from './PresentationalComponents';
import { FilterConfigBuilder, stringToId, buildFilterConfig } from './Utilities';
import { HIGH_SEVERITY, MEDIUM_SEVERITY, LOW_SEVERITY } from './Constants';
import ComplianceRemediationButton from './ComplianceRemediationButton';

class SystemRulesTable extends React.Component {
    state = {
        page: 1,
        itemsPerPage: 10,
        rows: [],
        sortBy: {},
        rules: [],
        ruleCount: 0,
        filterConfigBuilder: null,
        filterChips: []
    };

    combineDuplicateRules = (rules) => {
        const { selectedRefIds } = this.props;

        let rulesWithPolicies = [];
        rules.forEach((rule) => {
            const existingRule = rulesWithPolicies.filter((erule) => (erule.refId === rule.refId))[0];

            if (existingRule) {
                rulesWithPolicies[rulesWithPolicies.indexOf(existingRule)] = {
                    ...existingRule,
                    isSelected: selectedRefIds.includes(rule.refId),
                    policies: [
                        ...existingRule.policies,
                        ...rule.policies
                    ]
                };
            } else {
                rulesWithPolicies.push(rule);
            }
        });

        return rulesWithPolicies;
    }

    toRulesWithPolicies = (policiesWithRules) => {
        const { selectedRefIds } = this.props;
        const rules = policiesWithRules.flatMap((policy) => (
            policy.rules.map((rule) => (
                {
                    ...rule,
                    references: rule.references ? JSON.parse(rule.references) : [],
                    identifier: rule.identifier ? JSON.parse(rule.identifier) : [],
                    policies: [ policy.profile ],
                    isOpen: false,
                    isSelected: selectedRefIds.includes(rule.refId)
                }
            ))
        ));

        return this.combineDuplicateRules(rules);
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

    initFilterConfig = (callback) => {
        const config = buildFilterConfig(
            this.props.columns.filter((c) => (c.title === 'Passed')).length > 0,
            this.props.profileRules.map((p) => (p.profile)),
            {
                ...this.props.tailoringEnabled,
                ...this.props.selectedFilter,
                ...this.props.hidePassed
            }
        );
        const filterConfigBuilder = new FilterConfigBuilder(config);
        const chipBuilder = filterConfigBuilder.getChipBuilder();
        const filterBuilder = filterConfigBuilder.getFilterBuilder();

        this.setState({
            filterConfigBuilder,
            chipBuilder,
            filterBuilder,
            activeFilters: filterConfigBuilder.initialDefaultState({
                selected: this.props.selectedFilter ? [ 'selected' ] : undefined,
                passed: this.props.hidePassed ? [ 'failed' ] : undefined
            })
        }, callback ? callback() : () => ({}));
    }

    initFilterConfigWithRules = () => (
        this.initFilterConfig(() => (
            this.setState({
                rules: this.toRulesWithPolicies(this.props.profileRules)
            }, this.updateTable)
        ))
    )

    componentDidMount = () => (
        this.initFilterConfigWithRules()
    )

    componentDidUpdate = (prevProps) => {
        if (this.props.profileRules !== prevProps.profileRules) {
            this.initFilterConfigWithRules();
        }
    }

    updateChips = () => (
        this.state.chipBuilder.chipsFor(this.state.activeFilters).then((filterChips) => (
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
        this.state.filterConfigBuilder.applyFilterToObjectArray(
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
        const chipValue = this.state.filterConfigBuilder.valueForLabel(chips.chips[0].name, chipCategory);
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

    clearAllFilter = () => {
        this.setState({
            activeFilters: this.state.filterConfigBuilder.initialDefaultState(),
            filterChips: []
        }, this.updateTable);
    }

    onFilterDelete = (_event, chips, clearAll = false) => {
        clearAll ? this.clearAllFilter() : this.deleteFilter(chips[0]);
    }

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

    onSort = (_, index, direction, extraData) => {
        const _getSortable = (property, rule) => {
            switch (property) {
                case 'rule':
                    return rule.title;
                case 'policy':
                    return rule.policies[0].name;
                case 'severity':
                    return rule.severity;
                case 'passed':
                    return rule.compliant;
                case 'column-6':
                    return rule.remediationAvailable;
                default:
                    return rule.title;
            }
        };

        const property = extraData.property;
        const rules = this.state.rules.sort((a, b) => {
            if (direction === SortByDirection.asc) {
                return String(_getSortable(property, a)).localeCompare(String(_getSortable(property, b)));
            } else {
                return -String(_getSortable(property, a)).localeCompare(String(_getSortable(property, b)));
            }
        });

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
            sortBy, page, itemsPerPage, filterConfigBuilder, filterChips, rows, ruleCount
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

        if (loading || !filterConfigBuilder) {
            return <RuleLoadingTable columns={columns} />;
        } else {
            const filterConfig = filterConfigBuilder.buildConfiguration(
                this.onFilterUpdate,
                this.state.activeFilters,
                { hideLabel: true }
            );

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
