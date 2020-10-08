import React, { Fragment } from 'react';
import propTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

import { Table, TableHeader, TableBody, TableVariant, sortable } from '@patternfly/react-table';
import { CheckCircleIcon } from '@patternfly/react-icons';
import './IssueTable.scss';
import { Stack, StackItem, Text, TextContent } from '@patternfly/react-core';

function needsRebootCell (needsReboot) {
    if (needsReboot) {
        return <CheckCircleIcon color="green"/>;
    }

    return (' ');
}

function buildRows(issues, state, getResolution) {
    return issues.map(issue => {
        const resolutions = getResolution(issue.id);
        const { description, needs_reboot: needsReboot  } = resolutions?.[0] || {};
        const alternate = resolutions.length - 1;
        return {
            cells: [
                state.issuesById[issue.id].description,
                <Fragment key={`${issue.id}-description`}>
                    <p>
                        {description}
                    </p>
                    {alternate > 0 &&
                    (
                        <p>{alternate} alternate resolution</p>
                    )}
                </Fragment>,
                {
                    title: needsRebootCell(needsReboot),
                    value: needsReboot
                },
                getSystemCount(issue, state),
                issueType(issue.id)
            ]
        };
    });
}

function issueType (id) {
    switch (id.split(':')[0]) {
        case 'advisor': return 'Advisor';
        case 'ssg':
        case 'compliance':
            return 'Compliance';
        case 'vulnerabilities': return 'Vulnerability';
        case 'patch-advisory': return 'Patch';
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
        const { sortBy, sortDir, name } = this.state;
        const rows = buildRows(this.props.issues, this.props.state, this.props.getResolution);
        const sorted = orderBy(rows, r => {
            const cell = r.cells[sortBy];
            if (typeof cell === 'object') {
                return cell.value;
            }

            return cell;
        }, [ this.state.sortDir ]);

        return (
            <Stack hasGutter>
                <StackItem>
                    <TextContent>
                        <Text component="h3">
                            Playbook name: {name}
                        </Text>
                    </TextContent>
                </StackItem>
                <StackItem>
                </StackItem>

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
                            title: 'Reboot required',
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
            </Stack>
        );
    }
}

IssueTable.propTypes = {
    issues: propTypes.array.isRequired,
    getResolution: propTypes.func.isRequired,
    state: propTypes.object.isRequired
};

export default IssueTable;
