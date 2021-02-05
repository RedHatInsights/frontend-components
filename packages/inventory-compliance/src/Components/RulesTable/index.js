import React from 'react';
import propTypes from 'prop-types';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { AnsibeTowerIcon } from '@patternfly/react-icons';
import { Table, TableBody, TableHeader, sortable, fitContent } from '@patternfly/react-table';
import { TableToolbar, PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import useTableTools from '@redhat-cloud-services/frontend-components-utilities/useTableTools';
import ComplianceRemediationButton from '../../ComplianceRemediationButton';
import { Rule, Policy, Severity, Passed, Ansible } from './Cells';
import RuleDetailsRow from './RuleDetailsRow';
import EmptyRows from './EmptyRows';
import buildFilterConfig from './Filters';

/* eslint-disable react/display-name */
export const columns = [
    {
        title: 'Rule',
        prop: 'title',
        transforms: [ sortable ],
        sortByProperty: 'title',
        renderFunc: (rule) => (
            <Rule { ...{ rule } } />
        )
    }, {
        title: 'Policy',
        transforms: [ sortable ],
        sortByFunction: (rule) => (rule?.profile?.name),
        renderFunc: (rule) => (
            <Policy { ...{ rule } } />
        )
    }, {
        title: 'Severity',
        transforms: [ sortable, fitContent ],
        sortByArray: [ 'high', 'medium', 'low', 'unknown' ],
        renderFunc: (rule) => (
            <Severity { ...{ rule } } />
        )
    }, {
        title: 'Passed',
        transforms: [ sortable, fitContent ],
        sortByProperty: 'compliant',
        renderFunc: (rule) => (
            <Passed { ...{ rule } } />
        )
    }, {
        title: <React.Fragment><AnsibeTowerIcon /> Ansible</React.Fragment>,
        original: 'Ansible',
        prop: 'remediationAvailable',
        props: { tooltip: 'Ansible' },
        transforms: [ sortable, fitContent ],
        sortByProperty: 'remediationAvailable',
        renderFunc: (rule) => (
            <Ansible { ...{ rule } } />
        )
    }
];
/* eslint-enable */

export const selectedColumns = (columnTitles) => (
    columns.filter((column) => columnTitles.includes(column.original || column.title))
);

export const toRulesArrayWithProfile = (profilesWithRules) => (
    profilesWithRules.flatMap((profileWithRules) => (
        profileWithRules.rules.map((rule) => {
            const identifier = rule.identifier && JSON.parse(rule.identifier);
            return {
                ...rule,
                references: rule.references ? JSON.parse(rule.references) : [],
                identifier: identifier && identifier.label ? identifier : null,
                profile: profileWithRules.profile
            };
        })
    ))
);

const RulesTable = ({
    system, profileRules, columns, remediationsEnabled = false, selectedFilter, selectable = false
}) => {
    const rules = toRulesArrayWithProfile(profileRules);
    const showPassFailFilter = (columns.filter((c) => (c.title === 'Passed')).length > 0);
    // TODO: Selected actions
    const { toolbarProps, tableProps, selected: selectedRules } = useTableTools(rules, columns, {
        identifier: (item) => (
            `${item.refId}${ item.profile && `-${item.profile.refId}` }`
        ),
        selectable: selectable || remediationsEnabled,
        detailsComponent: RuleDetailsRow,
        emptyRows: EmptyRows,
        filterConfig: buildFilterConfig({
            selectedFilter,
            showPassFailFilter
        })
    });

    let dedicatedAction;
    if (remediationsEnabled) {
        const selectedRulesWithRemediations = (selectedRules || []).filter((rule) => (rule.remediationAvailable));
        dedicatedAction = remediationsEnabled &&
            <ComplianceRemediationButton
                allSystems={ [{ id: system.id, profiles: system.testResultProfiles, ruleObjectsFailed: [] }] }
                selectedRules={ selectedRulesWithRemediations } />;
    }

    return <React.Fragment>
        <PrimaryToolbar { ...toolbarProps } { ...{ dedicatedAction } }/>
        <Table className='compliance-rules-table' aria-label='Rules table' { ...tableProps }>
            <TableHeader />
            <TableBody />
        </Table>
        <TableToolbar isFooter className="ins-c-inventory__table--toolbar">
            <Pagination { ...toolbarProps.pagination } dropDirection='up' variant={ PaginationVariant.bottom } />
        </TableToolbar>
    </React.Fragment>;
};

RulesTable.propTypes = {
    profileRules: propTypes.array,
    loading: propTypes.bool,
    hidePassed: propTypes.bool,
    system: propTypes.object,
    remediationsEnabled: propTypes.bool,
    tailoringEnabled: propTypes.bool,
    selectedRefIds: propTypes.array,
    selectedFilter: propTypes.bool,
    handleSelect: propTypes.func,
    onSelect: propTypes.func,
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

const Wrapper = (props) => {
    const columnTitles = (props.columns || columns).flatMap((column) => ([ column.original, column.title ])).filter((v) => (!!v));
    const migratedColumns = columns.filter((column) => (
        columnTitles.includes(column.title) || columnTitles.includes(column.original)
    ));

    return <RulesTable { ...props } columns={ migratedColumns } />;
};

export default Wrapper;
