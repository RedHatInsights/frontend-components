import React from 'react';
import propTypes from 'prop-types';
import ComplianceRemediationButton from './ComplianceRemediationButton';
import { CheckIcon, CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { SimpleTableFilter, TableToolbar } from '@redhat-cloud-services/frontend-components';
import { Table, TableHeader, TableBody, SortByDirection } from '@patternfly/react-table';
import {
    InputGroup,
    Level,
    LevelItem,
    Grid,
    GridItem,
    Stack,
    StackItem,
    Pagination,
    PaginationVariant,
    Text,
    TextContent,
    TextVariants
} from '@patternfly/react-core';
import { RowLoader } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';
import flatMap from 'lodash/flatMap';
import './compliance.scss';
import RulesComplianceFilter from './RulesComplianceFilter';
import EmptyRows from './EmptyRows';
import debounce from 'lodash/debounce';

import {
    HIGH_SEVERITY,
    MEDIUM_SEVERITY,
    LOW_SEVERITY
} from './Constants';

class SystemRulesTable extends React.Component {
    state = {
        columns: this.props.columns,
        page: 1,
        itemsPerPage: this.props.itemsPerPage,
        rows: [],
        hidePassed: this.props.hidePassed,
        selectedFilter: this.props.selectedFilter,
        selectedRefIds: this.props.selectedRefIds,
        severity: [],
        policy: [],
        currentRows: [],
        refIds: {},
        profiles: {},
        sortBy: {}
    };

    removeRefIdPrefix = (refId) => {
        const splitRefId = refId.toLowerCase().split('xccdf_org.ssgproject.content_profile_')[1];
        if (splitRefId) {
            return splitRefId;
        } else {
            // Sometimes the reports contain IDs like "stig-rhel7-disa" which we can pass
            // directly
            return refId;
        }
    }

    setInitialCurrentRows() {
        const { hidePassed, itemsPerPage, severity, policy, selectedFilter } = this.state;
        let { profileRules } = this.props;
        const rowsRefIds = this.rulesToRows(profileRules);

        this.setState({
            currentRows: this.markSelectedRows(this.currentRows(1, itemsPerPage, rowsRefIds)),
            originalRows: rowsRefIds.rows,
            rows: this.markSelectedRows(rowsRefIds.rows),
            profiles: rowsRefIds.profiles,
            refIds: rowsRefIds.refIds
        }, () => {
            if (hidePassed || selectedFilter) {
                this.updateFilter(hidePassed, severity, policy, selectedFilter);
            }
        });
    }

    setColumnIndices = () => {
        const { columns } = this.state;
        const columnIndices = {};

        columns.forEach((column, index) => {
            if (column.title === 'Rule' || column.original === 'Rule') {
                columnIndices.TITLE_COLUMN = index;
            } else if (column.title === 'Policy' || column.original === 'Policy') {
                columnIndices.POLICY_COLUMN = index;
            } else if (column.title === 'Severity' || column.original === 'Severity') {
                columnIndices.SEVERITY_COLUMN = index;
            } else if (column.title === 'Passed' || column.original === 'Passed') {
                columnIndices.COMPLIANT_COLUMN = index;
            } else if (column.original === 'Ansible' || column.original === 'Ansible') {
                columnIndices.REMEDIATIONS_COLUMN = index;
            }
        });
        return columnIndices;
    }

    componentDidMount = () => {
        this.setState({
            columnIndices: this.setColumnIndices()
        }, this.setInitialCurrentRows);
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.profileRules !== prevProps.profileRules) {
            this.setInitialCurrentRows();
        }
    }

    changePage = (page, itemsPerPage) => {
        this.setState({
            currentRows: this.currentRows(page, itemsPerPage),
            page,
            itemsPerPage
        });
    }

    setPage = (_event, page) => {
        const { itemsPerPage } = this.state;
        this.changePage(page, itemsPerPage);
    }

    setPerPage = (_event, itemsPerPage) => {
        const { page } = this.state;
        this.changePage(page, itemsPerPage);
    }

    isParent = (row) => {
        return Object.prototype.hasOwnProperty.call(row, 'isOpen');
    }

    remediationAvailable = (remediationId) => {
        return remediationId ? <CheckIcon style={ { color: 'var(--pf-global--success-color--200)' } }/> : 'No';
    }

    currentRows = (page, itemsPerPage, rowsRefIds) => {
        const { rows } = (rowsRefIds) ? rowsRefIds : this.state;

        if (!rows.length) {
            return [];
        }

        if (rows.length < itemsPerPage * 2) { itemsPerPage = rows.length / 2; }

        const firstIndex = (page - 1) * itemsPerPage * 2;
        const lastIndex = page * itemsPerPage * 2;
        const newRows = flatMap(rows.slice(firstIndex, lastIndex), ({ parent, ...row }) => ({
            ...row,
            ...(
                (parent || parent === 0) ? parent > itemsPerPage ?
                    { parent: parent % (itemsPerPage * 2) } :
                    { parent } :
                    {}
            )
        }));

        return newRows;
    }

    selectAll = (rows, selected) => {
        return rows.map(row => (
            {
                ...row,
                ...this.isParent(row) ? { selected } : {}
            }
        ));
    }

    rowRefId = (row) => {
        const { columnIndices, refIds } = this.state;
        return refIds[row.cells[columnIndices.TITLE_COLUMN].original];
    }

    onSelect = (_event, selected, key) => {
        const { remediationsEnabled, tailoringEnabled, handleSelect } = this.props;
        const { columnIndices, page, itemsPerPage } = this.state;
        let { currentRows, rows, selectedRefIds } = this.state;

        if (key === -1) {
            rows = this.selectAll(rows, selected);
            currentRows = this.selectAll(currentRows, selected);
            if (selected) {
                selectedRefIds = rows.filter(row => this.isParent(row)).map(row => this.rowRefId(row));
            } else {
                selectedRefIds = [];
            }
        } else {
            // One rule was selected
            const index = ((page - 1) * itemsPerPage * 2) + Number(key);
            if (tailoringEnabled || remediationsEnabled && currentRows[index].cells[columnIndices.REMEDIATIONS_COLUMN].original) {
                rows[index].selected = selected;
                currentRows[key].selected = selected;

                const currentRefId = this.rowRefId(rows[index]);
                const currentRefIdInSelectedRefIds = selectedRefIds.indexOf(currentRefId);
                if (selected && currentRefIdInSelectedRefIds === -1) {
                    selectedRefIds.push(currentRefId);
                } else if (!selected && currentRefIdInSelectedRefIds !== -1) {
                    selectedRefIds.splice(currentRefIdInSelectedRefIds, 1);
                }
            }
        }

        this.setState({
            rows,
            currentRows,
            selectedRefIds
        }, () => handleSelect(selectedRefIds));
    }

    ruleTitleCell = (title, identifier) => <Stack>
        <StackItem>{ title }</StackItem>
        { identifier && <StackItem>
            <TextContent><Text component={ TextVariants.small }>{ identifier.label }</Text></TextContent>
        </StackItem> || '' }
    </Stack>

    columnsToTableHeaders = (columns, profile, { title, severity, compliant, identifier, remediationAvailable }) => (
        columns.map((column) => {
            let tableHeader;

            if (column.title === 'Rule') {
                tableHeader = { title: this.ruleTitleCell(title, JSON.parse(identifier)), original: title };
            } else if (column.title === 'Policy') {
                tableHeader = { title: profile.name, original: profile.name };
            } else if (column.title === 'Severity') {
                tableHeader = {
                    title: (severity.toLowerCase() === 'high' ? HIGH_SEVERITY :
                        severity.toLowerCase() === 'medium' ? MEDIUM_SEVERITY :
                            severity.toLowerCase() === 'low' ? LOW_SEVERITY : severity),
                    original: severity.toLowerCase()
                };
            } else if (column.title === 'Passed') {
                tableHeader = {
                    title: (compliant ? <CheckCircleIcon className='ins-u-passed' /> :
                        <ExclamationCircleIcon className='ins-u-failed' />),
                    original: compliant
                } ;
            } else if (column.original === 'Ansible') {
                tableHeader = {
                    title: (remediationAvailable ? <CheckIcon className='ins-c-compliance-system-rule-check' /> : 'No'),
                    original: remediationAvailable
                };
            } else {
                tableHeader = null;
            }

            return tableHeader;
        })
    );

    calculateParent = ({ profile }, rule) => {
        const { columns } = this.state;

        return {
            isOpen: false,
            cells: this.columnsToTableHeaders(columns, profile, rule).filter(e => e)
        };
    }

    conditionalLink = (children, href, additionalProps) => (
        href && <a href={ href } { ...additionalProps }>{ children }</a> || children
    )

    referencesList = (references) => references.reduce((acc, reference, i) => ([
        ...acc,
        i !== 0 ? ', ' : '',
        this.conditionalLink(reference.label, reference.href, { target: '_blank', key: i + 1 })
    ]), [])

    calculateChild = ({ description, rationale, identifier: JSONidentifier, references: JSONreferences }, key) => {
        const references = JSONreferences && JSONreferences.length && JSON.parse(JSONreferences);
        const identifier = JSONidentifier && JSON.parse(JSONidentifier);
        return {
            parent: key * 2,
            cells: [{
                originalIdentifier: identifier ? identifier.label : '',
                originalReferences: references ? references.map((r) => r.label).join() : '',
                title: (
                    <React.Fragment key={ key }>
                        <div className='margin-top-lg'>
                            <Stack id={ `rule-description-${key}` } className='margin-bottom-lg'>
                                <StackItem style={ { marginBottom: 'var(--pf-global--spacer--sm)' } }>
                                    <Text className='pf-c-form__label' component={ TextVariants.h5 }><b>Description</b></Text>
                                </StackItem>
                                <StackItem isFilled>{ description }</StackItem>
                            </Stack>
                            <Stack id={ `rule-identifiers-references-${key}` } className='margin-bottom-lg'>
                                <Grid>
                                    { identifier && <GridItem span={ 2 }>
                                        <Text className='pf-c-form__label' component={ TextVariants.h5 }><b>Identifier</b></Text>
                                        <Text>{ this.conditionalLink(identifier.label, identifier.system, { target: '_blank' }) }</Text>
                                    </GridItem> }

                                    { references ? <GridItem span={ 10 }>
                                        <Text className='pf-c-form__label' component={ TextVariants.h5 }><b>References</b></Text>
                                        <Text>{ this.referencesList(references) }</Text>
                                    </GridItem> : '' }
                                </Grid>
                            </Stack>
                            { rationale &&
                            <Stack id={ `rule-rationale-${key}` } style={ { marginBottom: 'var(--pf-global--spacer--lg)' } }>
                                <StackItem style={ { marginBottom: 'var(--pf-global--spacer--sm)' } }>
                                    <Text className='pf-c-form__label' component={ TextVariants.h5 }><b>Rationale</b></Text>
                                </StackItem>
                                <StackItem isFilled>{ rationale }</StackItem>
                            </Stack>
                            }
                        </div>
                    </React.Fragment>
                ) }]
        };
    }

    rulesToRows = (profileRules) => {
        const refIds = {};
        const profiles = {};
        const rows = flatMap(profileRules, (profileRule) => flatMap(profileRule.rules, (rule, key) => {
            if (profiles[rule.title]) {
                profiles[rule.title].name = `${profiles[rule.title].name}, ${profileRule.profile.name}`;
                return;
            } else {
                profiles[rule.title] = { refId: profileRule.profile.refId, name: profileRule.profile.name };
                refIds[rule.title] = rule.refId;
            }

            return [
                this.calculateParent(profileRule, rule),
                this.calculateChild(rule, key)
            ];
        })).filter(row => row); // Need to remove undefined (duplicate) rows

        for (let [ key, value ] of Object.entries(profiles)) {
            profiles[key] = value.refId;
        }

        return { rows, refIds, profiles };
    }

    onCollapse = (_event, rowKey, isOpen) => {
        const { rows, profiles, refIds } = this.state;
        const key = ((this.state.page - 1) * this.state.itemsPerPage * 2) + Number(rowKey);
        rows[key].isOpen = isOpen;
        this.setState({
            rows,
            currentRows: this.currentRows(this.state.page, this.state.itemsPerPage, { rows, profiles, refIds })
        });
    }

    selectedRules = () => {
        const { currentRows, profiles, columnIndices } = this.state;
        return currentRows.filter(row => row.selected && row.cells[columnIndices.REMEDIATIONS_COLUMN].original).map(row => ({
            // We want to match this response with a similar response from GraphQL
            refId: this.rowRefId(row),
            profiles: [{ refId: profiles[row.cells[columnIndices.TITLE_COLUMN].original] }],
            remediationAvailable: row.cells[columnIndices.REMEDIATIONS_COLUMN].original,
            title: row.cells[columnIndices.TITLE_COLUMN].original // This is the rule title, the description is too long
        }));
    }

    // This takes both the row and its children (collapsible rows) and puts them into
    // one element. It is used only so that the rows can be compared.
    compressRows = (rows) => {
        const compressedRows = [];
        rows.forEach((row, i) => {
            if (this.isParent(row)) {
                compressedRows.push({ parent: row, child: rows[i + 1] });
            }
        });

        return compressedRows;
    }

    uncompressRows(compressedRows) {
        const originalRows = [];
        compressedRows.forEach((compressedRow, i) => {
            originalRows.push(compressedRow.parent);
            if (compressedRow.child) {
                let child = compressedRow.child;
                child.parent = i * 2;
                originalRows.push(child);
            }
        });
        return originalRows;
    }

    handleSearch = debounce(searchTerm => {
        const { hidePassed, severity, policy, selectedFilter } = this.state;
        return this.setState({
            searchTerm
        }, () => this.updateFilter(hidePassed, severity, policy, selectedFilter));
    }, 500)

    onSort = (_event, index, direction) => {
        // Original index is not the right column, as patternfly adds 1 because
        // of the 'collapsible' button and 1 because of the checkbox.
        let column = index - 2;
        const { refIds, rows, page, profiles, itemsPerPage } = this.state;
        const sortedRows = this.uncompressRows(
            this.compressRows(rows).sort(
                (a, b) => {
                    if (direction === SortByDirection.asc) {
                        return String(a.parent.cells[column].original).localeCompare(String(b.parent.cells[column].original));
                    } else {
                        return -String(a.parent.cells[column].original).localeCompare(String(b.parent.cells[column].original));
                    }
                }
            )
        );

        return this.setState({
            currentRows: this.currentRows(page, itemsPerPage, { rows: sortedRows, profiles, refIds }),
            sortBy: {
                index,
                direction
            },
            rows: sortedRows
        });
    }

    filterBy = (attribute, rows, column) => {
        if (column === undefined) { return rows; }

        const filteredRows = [];
        rows.forEach((row, i) => {
            if (this.isParent(row) && String(row.cells[column].original).toLowerCase().match(
                String(attribute).toLowerCase()
            )) {
                filteredRows.push(row);
                if (!this.isParent(rows[i + 1])) {
                    filteredRows.push({
                        parent: filteredRows.length - 1,
                        cells: rows[i + 1].cells
                    });
                }
            }
        });

        return filteredRows;
    }

    searchBy = (searchTerm, rows) => {
        const { columnIndices } = this.state;
        const lowerString = (s) => String(s).toLowerCase();
        const filteredRows = [];
        if (searchTerm) {
            searchTerm = lowerString(searchTerm);
            rows.forEach((row, i) => {
                const titleMatches = this.isParent(row) && lowerString(row.cells[columnIndices.TITLE_COLUMN].original).match(searchTerm);
                const identifierMatches = !this.isParent(row) && lowerString(row.cells[columnIndices.TITLE_COLUMN].originalIdentifier).match(searchTerm);
                const referencesMatch = !this.isParent(row) && lowerString(row.cells[columnIndices.TITLE_COLUMN].originalReferences).match(searchTerm);

                if (titleMatches || identifierMatches || referencesMatch) {
                    let parent = this.isParent(row) ? row : rows[i - 1];
                    let child = this.isParent(row) ? rows[i + 1] : row;
                    filteredRows.push(parent);
                    filteredRows.push({
                        parent: filteredRows.length - 1,
                        cells: child.cells
                    });
                }
            });
        }

        return filteredRows;
    }

    appendToFilteredRows = (filterType, result, filteredRowsByType) => {
        if (filterType && String(filterType).length > 0 && result.length > 0) {
            result = result.filter(row => filteredRowsByType.map((row) => row.cells).includes(row.cells));
        } else if (filterType && String(filterType).length > 0 && result.length === 0) {
            result = filteredRowsByType;
        }

        return result;
    }

    filteredRows = (passedRows, severityRows, policyRows, searchRows, selectedRows,
        hidePassed, severity, policy, searchTerm, selectedFilter) => {
        let result;
        if (severity.length > 0 && hidePassed) {
            result = passedRows.filter(row => severityRows.map((row) => row.cells).includes(row.cells));
        } else if (hidePassed && severity.length === 0) {
            result = passedRows;
        } else if (severity.length > 0 && !hidePassed) {
            result = severityRows;
        } else {
            result = passedRows;
        }

        result = this.appendToFilteredRows(policy, result, policyRows);
        result = this.appendToFilteredRows(searchTerm, result, searchRows);
        result = this.appendToFilteredRows(selectedFilter, result, selectedRows);

        return this.recomputeParentId(result);
    }

    recomputeParentId = (rows) => (
        this.uncompressRows(this.compressRows(rows))
    )

    getSelectedRows = (rows) => {
        const { selectedRefIds } = this.state;
        let selectedRows = [];
        rows.forEach((row, i) => {
            if (this.isParent(row) && selectedRefIds.includes(this.rowRefId(row))) {
                selectedRows.push(row);
                if (!this.isParent(rows[i + 1])) {
                    selectedRows.push({
                        parent: selectedRows.length - 1,
                        cells: rows[i + 1].cells
                    });
                }
            }
        });
        return selectedRows;
    }

    markSelectedRows = (rows) => {
        const { selectedRefIds } = this.state;
        return rows.map(row => (
            {
                ...row,
                ...this.isParent(row) && selectedRefIds.includes(this.rowRefId(row)) ? { selected: true } : {}
            }
        ));
    }

    updateFilter = (hidePassed, severity, policy, selectedFilter) => {
        const { columnIndices, originalRows, profiles, refIds, itemsPerPage, searchTerm } = this.state;

        let passedRows;
        if (hidePassed) {
            passedRows = this.filterBy(!hidePassed, originalRows, columnIndices.COMPLIANT_COLUMN);
        } else {
            passedRows = originalRows;
        }

        const selectedRows = this.getSelectedRows(originalRows);
        const severityRows = this.filterBy(severity.join('|'), originalRows, columnIndices.SEVERITY_COLUMN);
        const policyRows = this.filterBy(policy, originalRows, columnIndices.POLICY_COLUMN);
        const searchRows = this.searchBy(searchTerm, originalRows);
        const filteredRows = this.filteredRows(passedRows, severityRows, policyRows, searchRows, selectedRows,
            hidePassed, severity, policy, searchTerm, selectedFilter);

        return this.setState({
            currentRows: this.markSelectedRows(this.currentRows(1, itemsPerPage, { rows: filteredRows, profiles, refIds })),
            page: 1,
            rows: this.markSelectedRows(filteredRows),
            hidePassed,
            severity,
            policy,
            searchTerm
        });
    }

    render() {
        const { columnIndices, hidePassed, selectedFilter, sortBy, rows, currentRows, columns, page, itemsPerPage } = this.state;
        const { remediationsEnabled, tailoringEnabled, system, loading, profileRules } = this.props;

        if (loading) {
            return (
                <Table
                    cells={ columns }
                    aria-label='Loading table'
                    rows={ [ ...Array(10) ].map(() => ({
                        cells: [{
                            title: <RowLoader />,
                            colSpan: 5
                        }]
                    })) }>
                    <TableHeader />
                    <TableBody />
                </Table>
            );
        } else {
            /* eslint-disable camelcase */
            return (
                <React.Fragment>
                    <TableToolbar>
                        <Level gutter='md'>
                            <LevelItem>
                                <InputGroup>
                                    <RulesComplianceFilter
                                        hidePassed={hidePassed}
                                        selected = { selectedFilter }
                                        selectedFilter={ tailoringEnabled }
                                        showPassFailFilter={ (columnIndices && columnIndices.COMPLIANT_COLUMN !== undefined) || false }
                                        availablePolicies={ profileRules.map(profile => profile.profile) }
                                        updateFilter={ this.updateFilter } />
                                    <SimpleTableFilter buttonTitle={ null }
                                        onFilterChange={ this.handleSearch }
                                        placeholder="Search by name, identifer, or reference" />
                                </InputGroup>
                            </LevelItem>
                            <LevelItem>
                                { rows.length / 2 } results
                            </LevelItem>
                            { remediationsEnabled &&
                                <LevelItem>
                                    <ComplianceRemediationButton
                                        allSystems={ [{ id: system.id, ruleObjectsFailed: [] }] }
                                        selectedRules={ this.selectedRules() } />
                                </LevelItem>
                            }
                        </Level>
                        <Pagination
                            page={ page }
                            itemCount={ rows.length / 2 }
                            dropDirection='down'
                            onSetPage={ this.setPage }
                            onPerPageSelect={ this.setPerPage }
                            perPage={ itemsPerPage }
                        />
                    </TableToolbar>
                    <Table
                        className='compliance-rules-table'
                        aria-label='Rules table'
                        cells={ columns }
                        onCollapse={ this.onCollapse }
                        onSort={ this.onSort }
                        sortBy={ sortBy }
                        onSelect={ ((tailoringEnabled || remediationsEnabled) && currentRows.length !== 0) ? this.onSelect : undefined }
                        rows={ (currentRows.length === 0) ? EmptyRows : currentRows }>
                        <TableHeader />
                        <TableBody />
                    </Table>
                    <TableToolbar isFooter className="ins-c-inventory__table--toolbar">
                        <Pagination
                            page={ page }
                            itemCount={ rows.length / 2 }
                            dropDirection='up'
                            onSetPage={ this.setPage }
                            onPerPageSelect={ this.setPerPage }
                            perPage={ itemsPerPage }
                            variant={ PaginationVariant.bottom }
                        />
                    </TableToolbar>
                </React.Fragment>
            );
            /* eslint-enable camelcase */
        }
    }
}

SystemRulesTable.propTypes = {
    profileRules: propTypes.array,
    loading: propTypes.bool,
    hidePassed: propTypes.bool,
    severity: propTypes.array,
    rows: propTypes.array,
    system: propTypes.object,
    itemsPerPage: propTypes.number,
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
    itemsPerPage: 10,
    remediationsEnabled: true,
    tailoringEnabled: false,
    selectedRefIds: [],
    handleSelect: (() => {})
};

export default SystemRulesTable;
