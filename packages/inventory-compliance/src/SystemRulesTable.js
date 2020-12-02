import React from 'react';
import propTypes from 'prop-types';
import { Pagination, PaginationVariant, ToolbarItem } from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon, AnsibeTowerIcon } from '@patternfly/react-icons';
import { Table, TableHeader, TableBody, sortable, fitContent } from '@patternfly/react-table';
import { TableToolbar, PrimaryToolbar } from '@redhat-cloud-services/frontend-components';

import './compliance.scss';
import { RuleChildRow, RuleTitle, RuleLoadingTable, EmptyRows } from './PresentationalComponents';
import {
    FilterConfigBuilder, buildFilterConfig, POLICIES_FILTER_CONFIG,
    toRulesArray, orderByArray, orderRuleArrayByProp
} from './Utilities';
import { HIGH_SEVERITY, MEDIUM_SEVERITY, LOW_SEVERITY } from './Constants';
import ComplianceRemediationButton from './ComplianceRemediationButton';

export const columns = [
    { title: 'Rule', transforms: [ sortable ] },
    { title: 'Policy', transforms: [ sortable ] },
    { title: 'Severity', transforms: [ sortable, fitContent ] },
    { title: 'Passed', transforms: [ sortable, fitContent ] },
    { title: <React.Fragment><AnsibeTowerIcon /> Ansible</React.Fragment>,
        original: 'Ansible', props: { tooltip: 'Ansible' }, transforms: [ sortable, fitContent ] }
];

export const selectColumns = (columnTitles) => (
    columns.filter((column) => columnTitles.includes(column.original || column.title))
);

class SystemRulesTable extends React.Component {
    config = buildFilterConfig({
        selectedFilter: this.props.selectedFilter,
        showPassFailFilter: (this.props.columns.filter((c) => (c.title === 'Passed')).length > 0)
    });
    filterConfigBuilder = new FilterConfigBuilder(this.config);
    chipBuilder = this.filterConfigBuilder.getChipBuilder();
    filterBuilder = this.filterConfigBuilder.getFilterBuilder();

    state = {
        page: 1,
        itemsPerPage: 10,
        rows: [],
        sortBy: {},
        ruleCount: 0,
        selectedToRemediate: [],
        openIds: [],
        activeFilters: this.filterConfigBuilder.initialDefaultState({
            selected: this.props.selectedFilter ? [ 'selected' ] : undefined,
            passed: this.props.hidePassed ? 'failed' : undefined
        })
    };

    parentRowForRule = (rule) => {
        const {
            title, identifier, profiles, severity, compliant, rowKey,
            remediationAvailable, refId, isOpen, isSelected
        } = rule;
        const cells = this.props.columns.map((column) => {
            let cell;

            switch (column.original || column.title) {
                case 'Rule':
                    cell = <RuleTitle title={ title } identifier={ identifier } />;
                    break;
                case 'Policy':
                    cell = profiles.map((p) => p.name).slice(0, 1).join(', ');
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
                        <CheckCircleIcon className='ins-u-passed' /> : 'No');
                    break;
            }

            return cell ? {
                title: cell
            } : null;
        });

        return {
            refId,
            rowKey,
            selected: isSelected,
            isOpen,
            cells
        };
    }

    childRowForRule = (rule, idx) => ({
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

    onSort = (_, index, direction, extraData) => (
        this.setState({
            sortBy: {
                index,
                direction,
                property: extraData.property
            }
        })
    )

    sortedRules = (rules) => {
        const { property, direction } = this.state.sortBy;
        return this.getSorter(property)(property, rules, direction);
    }

    paginatedRules = (rules) => (
        rules.slice(
            (this.state.page - 1) * this.state.itemsPerPage,
            this.state.page * this.state.itemsPerPage
        )
    )

    filteredRules = (rules) => (
        this.filterConfigBuilder.applyFilterToObjectArray(
            rules, this.state.activeFilters
        )
    )

    selectedRules = (rules) => {
        const { selectedRefIds, remediationsEnabled } = this.props;
        const { selectedToRemediate } = this.state;

        return rules.map((rule) => {
            const isSelected = remediationsEnabled ?
                selectedToRemediate.includes(rule.rowKey) : selectedRefIds.includes(rule.refId);
            return {
                ...rule,
                isSelected
            };
        });
    }

    openedRules = (rules) => (
        rules.map((rule) => ({
            ...rule,
            isOpen: this.state.openIds.includes(rule.rowKey)
        }))
    )

    getRules = () => {
        const rules = toRulesArray(this.props.profileRules);
        return this.sortedRules(
            this.filteredRules(
                this.selectedRules(this.openedRules(rules))
            )
        );
    }

    updatePolicyFilterConfig = () => {
        let policies = this.props.profileRules.filter(({ profile }) => !!profile).map(({ profile }) => (
            {
                id: profile.policy ? profile.policy.id : profile.id,
                name: profile.name
            }
        ));

        if (policies.length > 1) {
            this.filterConfigBuilder.addConfigItem(POLICIES_FILTER_CONFIG(policies));
            this.forceUpdate();
        }
    }

    componentDidMount = () => {
        this.updatePolicyFilterConfig();
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.profileRules !== prevProps.profileRules) {
            this.updatePolicyFilterConfig();
        }
    }

    onFilterUpdate = (filter, values) => (
        this.setState({
            page: 1,
            activeFilters: {
                ...this.state.activeFilters,
                [filter]: values
            }
        })
    )

    deleteFilter = (chips) => {
        const activeFilters =  this.filterConfigBuilder.removeFilterWithChip(
            chips, this.state.activeFilters
        );
        this.setState({
            activeFilters
        });
    }

    clearAllFilter = () => (
        this.setState({
            activeFilters: this.filterConfigBuilder.initialDefaultState()
        })
    )

    onFilterDelete = (_event, chips, clearAll = false) => (
        clearAll ? this.clearAllFilter() : this.deleteFilter(chips[0])
    )

    changePage = (page, itemsPerPage) => (
        this.setState({
            page,
            itemsPerPage
        })
    )

    setPage = (_, page) => (
        this.changePage(page, this.state.itemsPerPage)
    )

    setPerPage = (_, itemsPerPage) => (
        this.changePage(1, itemsPerPage)
    )

    selectAllCheckbox = (key) => (key === -1)

    onSelect = (_, selected, key, rowData) => {
        const { handleSelect, selectedRefIds } = this.props;

        let selectedRuleIds;
        if (this.selectAllCheckbox(key)) {
            selectedRuleIds = this.getRules().map((rule) => rule.refId);
        } else {
            selectedRuleIds = selected ?
                [ ...selectedRefIds, rowData.refId ] :
                selectedRefIds.filter((refId) => (refId !== rowData.refId));
        }

        if (handleSelect) {
            handleSelect(selectedRuleIds);
        }
    }

    onSelectToRemediate = (_, selected, key, rowData) => {
        const { selectedToRemediate: currentlySelectToRemediate } = this.state;
        let selectedToRemediate;

        if (this.selectAllCheckbox(key)) {
            selectedToRemediate = this.getRules().map((rule) => rule.rowKey);
        } else {
            selectedToRemediate = selected ?
                [ ...currentlySelectToRemediate, rowData.rowKey ] :
                currentlySelectToRemediate.filter((refId) => (refId !== rowData.rowKey));
        }

        this.setState({
            selectedToRemediate
        });
    }

    onCollapse = (_e, _k, isOpen, rowData) => {
        const currentlyOpenIds = this.state.openIds;
        const openIds = isOpen ?
            [ ...currentlyOpenIds, rowData.rowKey ] :
            currentlyOpenIds.filter((rowKey) => (
                rowKey !== rowData.rowKey
            ));
        this.setState({
            openIds
        });
    }

    render() {
        const {
            sortBy, page, itemsPerPage, selectedToRemediate
        } = this.state;
        const {
            remediationsEnabled, system, loading, columns, handleSelect
        } = this.props;
        const rules = this.getRules();
        const filterChips = this.chipBuilder.chipsFor(this.state.activeFilters);
        const rows = this.rulesToRows(this.paginatedRules(rules));
        const ruleCount = rules.length;
        const pagination = {
            itemCount: ruleCount,
            page,
            perPage: itemsPerPage,
            onSetPage: this.setPage,
            onPerPageSelect: this.setPerPage
        };
        const selectedRulesWithRemediations = rules && rules.filter((rule) => (
            selectedToRemediate.includes(rule.rowKey) && rule.remediationAvailable
        ));
        const onSelect = !handleSelect && !remediationsEnabled ? undefined :
            (remediationsEnabled ? this.onSelectToRemediate : this.onSelect);
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
                        <ToolbarItem>
                            <ComplianceRemediationButton
                                allSystems={ [{ id: system.id, profiles: system.profiles, ruleObjectsFailed: [] }] }
                                selectedRules={ selectedRulesWithRemediations } />
                        </ToolbarItem>
                    }
                    <ToolbarItem>
                        { ruleCount } results
                    </ToolbarItem>
                </PrimaryToolbar>
                <Table
                    className='compliance-rules-table'
                    aria-label='Rules table'
                    cells={ columns }
                    onCollapse={ this.onCollapse }
                    onSort={ this.onSort }
                    sortBy={ sortBy }
                    onSelect={ (ruleCount === 0) ? undefined : onSelect }
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
    columns: columns
};

export default SystemRulesTable;
