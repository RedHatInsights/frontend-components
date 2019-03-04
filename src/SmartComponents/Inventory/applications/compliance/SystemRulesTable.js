import React from 'react';
import propTypes from 'prop-types';
import * as remediationsApi from '../../../../api/remediations';
import ComplianceRemediationButton from './ComplianceRemediationButton';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import routerParams from '../../../../Utilities/RouterParams';
import { Ansible } from '../../../../PresentationalComponents/Ansible';
import { Pagination } from '../../../../PresentationalComponents/Pagination';
import { TableToolbar } from '../../../../PresentationalComponents/TableToolbar';
import { Table, TableHeader, TableBody, sortable, SortByDirection } from '@patternfly/react-table';
import { SearchIcon } from '@patternfly/react-icons';
import { Checkbox, Level, LevelItem, Stack, StackItem } from '@patternfly/react-core';
import { RowLoader } from '../../../../Utilities/helpers';
import flatMap from 'lodash/flatMap';
import './compliance.scss';

const COMPLIANT_COLUMN = 3;

class SystemRulesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Rule', transforms: [ sortable ]},
                { title: 'Policy', transforms: [ sortable ]},
                { title: 'Severity', transforms: [ sortable ]},
                { title: 'Passed', transforms: [ sortable ]},
                { title: 'Remediation' }
            ],
            page: 1,
            itemsPerPage: 10,
            hidePassedChecked: false,
            rows: [],
            currentRows: [],
            refIds: {},
            sortBy: {}
        };
    }

    setInitialCurrentRows() {
        const { itemsPerPage } = this.state;
        const { hidePassed, profileRules } = this.props;
        const rowsRefIds = this.rulesToRows(profileRules);
        this.currentRows(1, itemsPerPage, rowsRefIds).then((currentRows) => {
            this.setState(() => (
                {
                    currentRows,
                    rows: rowsRefIds.rows,
                    refIds: rowsRefIds.refIds
                }
            ));
            if (hidePassed) {
                this.hidePassed(true);
            }
        });
    }

    componentDidMount = () => {
        this.setInitialCurrentRows();
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.profileRules !== prevProps.profileRules) {
            this.setInitialCurrentRows();
        }
    }

    changePage = (page, itemsPerPage) => {
        this.currentRows(page, itemsPerPage).then((currentRows) => {
            this.setState(() => (
                {
                    page,
                    itemsPerPage,
                    currentRows
                }
            ));
        });
    }

    setPage = (page) => {
        const { itemsPerPage } = this.state;
        this.changePage(page, itemsPerPage);
    }

    setPerPage = (itemsPerPage) => {
        const { page } = this.state;
        this.changePage(page, itemsPerPage);
    }

    isParent = (row) => {
        return row.hasOwnProperty('isOpen');
    }

    remediationAvailable = (remediationId) => {
        return remediationId ? <Ansible/> : <Ansible unsupported />;
    }

    currentRows = (page, itemsPerPage, rowsRefIds) => {
        const { rows, refIds } = (rowsRefIds) ? rowsRefIds : this.state;

        if (!rows.length) {
            // Avoid even making an empty request to the remediations API
            return Promise.resolve([]);
        }

        const firstIndex = (page - 1) * itemsPerPage * 2;
        const lastIndex = page * itemsPerPage * 2;
        const newRows = flatMap(rows.slice(firstIndex, lastIndex), ({ parent, ...row }) => ({
            ...row,
            ...((parent || parent === 0) ? parent > itemsPerPage ? { parent: parent % (itemsPerPage * 2) } : { parent } : {})
        }));

        const ruleIds = newRows.filter(row => row.hasOwnProperty('isOpen'))
        .map(({ cells }) => `compliance:${refIds[cells[0]]}`);

        return window.insights.chrome.auth.getUser()
        .then(() => {
            return remediationsApi.getResolutionsBatch(ruleIds)
            .then(response => newRows.map(({ cells, ...row }) => ({
                ...row,
                cells: [
                    ...cells,
                    ...this.isParent(row, cells) ? [ this.remediationAvailable(response[`compliance:${refIds[cells[0]]}`]) ] : []
                ]
            })));
        });
    }

    selectAll = (rows, selected) => {
        return rows.map(row => (
            {
                ...row,
                ...this.isParent(row) ? { selected } : {}
            }
        ));
    }

    onSelect = (_event, selected, key) => {
        const { page, itemsPerPage } = this.state;
        let { currentRows, rows } = this.state;
        if (key === -1) {
            rows = this.selectAll(rows, selected);
            currentRows = this.selectAll(currentRows, selected);
        } else {
            // One rule was selected
            const index = ((page - 1) * itemsPerPage * 2) + Number(key);
            rows[index].selected = selected;
            currentRows[key].selected = selected;
        }

        this.setState({ rows, currentRows });
    }

    calculateParent = ({ profile }, { title, severity, compliant }) => ({
        isOpen: false,
        cells: [
            title,
            profile,
            severity,
            (compliant ? <CheckCircleIcon className='ins-u-passed' /> :
                <ExclamationCircleIcon className='ins-u-failed' />)
        ]
    })

    calculateChild = ({ description, rationale }, key) => ({
        parent: key * 2,
        cells: [{
            title: (
                <React.Fragment key={ key }>
                    <Stack id={ `rule-description-${key}` } gutter="md">
                        <StackItem><b>Description</b></StackItem>
                        <StackItem isMain>{ description }</StackItem>
                    </Stack>
                    <br/>
                    <Stack id={ `rule-rationale-${key}` } gutter="md">
                        <StackItem><b>Rationale</b></StackItem>
                        <StackItem isMain>{ rationale }</StackItem>
                    </Stack>
                </React.Fragment>
            ) }]
    })

    rulesToRows = (profileRules) => {
        const refIds = {};
        const rows = flatMap(profileRules, (profileRule) => flatMap(profileRule.rules, (rule, key) => {
            refIds[rule.title] = rule.ref_id;
            return [
                this.calculateParent(profileRule, rule),
                this.calculateChild(rule, key)
            ];
        }));
        return { rows, refIds };
    }

    onCollapse = (_event, rowKey, isOpen) => {
        const { rows, refIds } = this.state;
        const key = ((this.state.page - 1) * this.state.itemsPerPage * 2) + Number(rowKey);
        rows[key].isOpen = isOpen;
        this.currentRows(this.state.page, this.state.itemsPerPage, { rows, refIds }).then((currentRows) => {
            this.setState(() => ({ rows, currentRows }));
        });
    }

    selectedRules = () => {
        const { rows, refIds } = this.state;
        return rows.filter(row => row.selected).map(row => ({
            // We want to match this response with a similar response from GraphQL
            // eslint-disable-next-line camelcase
            ref_id: refIds[row.cells[0]],
            title: row.cells[0] // This is the rule title, the description is too long
        }));
    }

    // This takes both the row and its children (collapsible rows) and puts them into
    // one element. It is used only so that the rows can be compared.
    compressRows = (rows) => {
        const compressedRows = [];
        rows.forEach((row, i) => {
            if (row.hasOwnProperty('isOpen')) {
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

    onSort = (_event, index, direction) => {
        // Original index is not the right column, as patternfly adds 1 because
        // of the 'collapsible' button and 1 because of the checkbox.
        let column = index - 2;
        const { refIds, rows, page, itemsPerPage } = this.state;
        const sortedRows = this.uncompressRows(
            this.compressRows(rows).sort(
                (a, b) => {
                    if (direction === SortByDirection.asc) {
                        if (column === COMPLIANT_COLUMN) {
                            return a.parent.cells[column].props.className === b.parent.cells[column].props.className ? 0 :
                                a.parent.cells[column].props.className < b.parent.cells[column].props.className ? 1 : -1;
                        } else {
                            return a.parent.cells[column].localeCompare(b.parent.cells[column]);
                        }

                    } else {
                        if (column === COMPLIANT_COLUMN) {
                            return a.parent.cells[column].props.className === b.parent.cells[column].props.className ? 0 :
                                a.parent.cells[column].props.className > b.parent.cells[column].props.className ? 1 : -1;
                        } else {
                            return -a.parent.cells[column].localeCompare(b.parent.cells[column]);
                        }
                    }
                }
            )
        );
        this.currentRows(page, itemsPerPage, { rows: sortedRows, refIds }).then((currentRows) => {
            this.setState(() => ({
                currentRows,
                sortBy: {
                    index,
                    direction
                },
                rows: sortedRows
            }));
        });
    }

    hidePassed = (checked) => {
        const { rows, originalRows, refIds, page, itemsPerPage } = this.state;
        if (checked) {
            const onlyPassedRows = [];
            rows.forEach((row, i) => {
                if (row.hasOwnProperty('isOpen') && row.cells[COMPLIANT_COLUMN].props.className === 'ins-u-failed') {
                    onlyPassedRows.push(row);
                    if (!rows[i + 1].hasOwnProperty('isOpen')) {
                        let child = rows[i + 1];
                        child.parent = onlyPassedRows.length - 1;
                        onlyPassedRows.push(child);
                    }
                }
            });

            this.currentRows(page, itemsPerPage, { rows: onlyPassedRows, refIds }).then((currentRows) => {
                this.setState(() => ({
                    currentRows,
                    originalRows: rows,
                    rows: onlyPassedRows,
                    hidePassedChecked: checked
                }));
            });
        } else {
            this.currentRows(page, itemsPerPage, { rows: originalRows, refIds }).then((currentRows) => {
                this.setState(() => ({
                    currentRows,
                    rows: originalRows,
                    hidePassedChecked: checked
                }));
            });
        }
    }

    render() {
        const { sortBy, hidePassedChecked, rows, currentRows, columns, page, itemsPerPage } = this.state;
        const { loading } = this.props;
        if (loading) {
            return (
                <Table
                    cells={ columns }
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
            return (
                <React.Fragment>
                    <TableToolbar>
                        <Level gutter='md'>
                            <LevelItem>
                                <Checkbox checked={ hidePassedChecked } onChange={ this.hidePassed } label={ 'Hide Passed Rules' } />
                            </LevelItem>
                            <LevelItem>
                                { rows.length / 2 } results
                            </LevelItem>
                            <LevelItem>
                                <ComplianceRemediationButton selectedRules={ this.selectedRules() } />
                            </LevelItem>
                        </Level>
                    </TableToolbar>
                    <Table
                        cells={ columns }
                        onCollapse={ this.onCollapse }
                        onSort={ this.onSort }
                        sortBy={ sortBy }
                        onSelect={ this.onSelect }
                        rows={ currentRows }>
                        <TableHeader />
                        <TableBody />
                    </Table>
                    <Pagination
                        numberOfItems={ rows.length / 2 }
                        onPerPageSelect={ this.setPerPage }
                        page={ page }
                        onSetPage={ this.setPage }
                        itemsPerPage={ itemsPerPage }
                    />
                </React.Fragment>
            );
        }
    }
}

SystemRulesTable.propTypes = {
    profileRules: propTypes.array,
    loading: propTypes.bool,
    hidePassed: propTypes.bool
};

SystemRulesTable.defaultProps = {
    profileRules: [{ rules: []}]
};

export default routerParams(SystemRulesTable);
