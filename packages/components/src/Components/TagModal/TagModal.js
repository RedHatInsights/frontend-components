import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './tagModal.scss';
import { Modal } from '@patternfly/react-core';
import {
    Table,
    TableHeader,
    TableBody,
    sortable,
    SortByDirection,
    headerCol,
    TableVariant,
    expandable,
    cellWidth,
    textCenter,
  } from '@patternfly/react-table';
  

export default class TagModal extends React.Component {
    constructor(props) {
        super(props);
        let rows = []
        //this bit should be replaced with an API call when the backend is ready
        if(props.systemName == 'paul.localhost.com') {
            rows = [
                {
                    cells: ['environment=production', 'AWS']
                },
                {
                    cells: ['owner=finanace', 'AWS']
                },
                {
                    cells: ['pants=worn', 'AWS']
                },
                {
                    cells: ['fit=F R E S H', 'AWS']
                },
                {
                    cells: ['clams=casino', 'AWS']
                },
                {
                    cells: ['OS=RHEL', 'AWS']
                },
                {
                    cells: ['computer=fast', 'AWS']
                },
                {
                    cells: ['Iam=SPEED!', 'AWS']
                },
                {
                    cells: ['beans=food', 'AWS']
                },
                {
                    cells: ['thing=otherthing', 'AWS']
                },
                {
                    cells: ['cheese=cheddar', 'AWS']
                }
            ];
        } else {
            rows = [
                {
                    cells: ['environment=staging', 'AWS']
                },
                {
                    cells: ['owner=engineering', 'AWS']
                }
            ];
        }

        this.state = {
            columns: [
                { title: 'Name' },
                { title: 'Tag Source' }
            ],
            rows: rows
        };
    }
    render() {
        return(
            <Modal
            width={'50%'}
            title={"Tags for " + this.props.systemName}
            isOpen={this.props.modalOpen}
            onClose={this.handleModalToggle}
            isFooterLeftAligned
            >
                <Table cells={this.state.columns} rows={this.state.rows}>
                    <TableHeader />
                    <TableBody />
                </Table>
            </Modal>
        )
    }
}