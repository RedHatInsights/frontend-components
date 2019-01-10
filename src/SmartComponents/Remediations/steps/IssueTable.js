import React, { Component } from 'react';
import propTypes from 'prop-types';

import { Table } from '../../../PresentationalComponents/Table';

function buildRows(issues, state, getResolution) {
    return issues.map(issue => {
        const resolution = getResolution(issue.id);
        return {
            cells: [
                state.issuesById[issue.id].description,
                issueType(issue.id),
                resolution.description,
                resolution.needs_reboot ? 'true' : 'false',
                getSystemCount(issue, state)
            ]
        };
    });
}

function issueType (id) {
    switch (id.split(':')[0]) {
        case 'advisor': return 'Advisor';
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

function IssueTable(props) {
    const rows = buildRows(props.issues, props.state, props.getResolution);

    return (
        <Table
            header={ [
                {
                    title: 'Action',
                    hasSort: false
                }, {
                    title: 'Type',
                    hasSort: false
                }, {
                    title: 'Resolution',
                    hasSort: false
                }, {
                    title: 'Reboot Required',
                    hasSort: false
                }, {
                    title: 'Systems',
                    hasSort: false
                }]
            }
            rows={ rows }
        />
    );
}

IssueTable.propTypes = {
    issues: propTypes.array.isRequired,
    getResolution: propTypes.func.isRequired,
    state: propTypes.object.isRequired
};

export default IssueTable;
