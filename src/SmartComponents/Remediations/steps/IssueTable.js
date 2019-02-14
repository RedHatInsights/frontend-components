import React, { Component } from 'react';
import propTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

import { Table, TableHeader, TableBody, TableVariant, sortable } from '@patternfly/react-table';
import './IssueTable.scss';

function buildRows(issues, state, getResolution) {
    return issues.map(issue => {
        const resolution = getResolution(issue.id);
        return {
            cells: [
                state.issuesById[issue.id].description,
                resolution.description,
                resolution.needs_reboot ? 'true' : 'false',
                getSystemCount(issue, state),
                issueType(issue.id)
            ]
        };
    });
}

function issueType (id) {
    switch (id.split(':')[0]) {
        case 'advisor': return 'Insights';
        case 'compliance': return 'Compliance';
        case 'vulnerabilities': return 'Vulnerability';
        default: return 'Unknown';
    }
}

function getSystemCount (issue, state) {
    if (issue.systems) {
        return issue.systems.length;
    }

    return state.open.data.systems.length;
}

class IssueTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortBy: 0,
            sortDir: 'asc'
        };
    }

    onSort = (event, sortBy, sortDir) => this.setState({ sortBy, sortDir });

    render () {
        const { sortBy, sortDir } = this.state;
        const rows = buildRows(this.props.issues, this.props.state, this.props.getResolution);
        const sorted = orderBy(rows, r => r.cells[sortBy], [ this.state.sortDir ]);

        return (
            <Table
                aria-label='Actions'
                className='ins-c-remediation-summary-table'
                variant={ TableVariant.compact }
                cells={ [
                    {
                        title: 'Action',
                        transforms: [ sortable ]
                    }, {
                        title: 'Resolution'
                    }, {
                        title: 'Reboot Required',
                        transforms: [ sortable ]
                    }, {
                        title: 'Systems',
                        transforms: [ sortable ]
                    }, {
                        title: 'Type',
                        transforms: [ sortable ]
                    }]
                }
                rows={ sorted }
                onSort={ this.onSort }
                sortBy={ { index: sortBy, direction: sortDir } }
            >
                <TableHeader />
                <TableBody />
            </Table>
        );
    }
}

IssueTable.propTypes = {
    issues: propTypes.array.isRequired,
    getResolution: propTypes.func.isRequired,
    state: propTypes.object.isRequired
};

export default IssueTable;
