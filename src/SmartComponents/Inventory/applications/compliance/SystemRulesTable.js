import React from 'react';
import propTypes from 'prop-types';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import ComplianceRemediationButton from './ComplianceRemediationButton';
import routerParams from '../../../../Utilities/RouterParams';
import { Table } from '../../../../PresentationalComponents/Table';
import { Input } from '../../../../PresentationalComponents/Input';
import { Pagination } from '../../../../PresentationalComponents/Pagination';
import { SearchIcon } from '@patternfly/react-icons';
import { Grid, GridItem, Text, TextVariants } from '@patternfly/react-core';
import { RowLoader } from '../../../../Utilities/helpers';

/* eslint camelcase: off */
const defaultState = {
    openNodes: [],
    page: 1,
    itemsPerPage: 10,
    rows: [],
    calculated: false
};

class SystemRulesTable extends React.Component {
    state = defaultState;

    static getDerivedStateFromProps({ profileRules }, state) {
        if (profileRules) {
            return {
                ...state,
                calculated: true,
                rows: state.calculated ? state.rows : SystemRulesTable.rulesToRows(profileRules)
            };
        }

        return null;
    }

    static rulesToRows(profileRules) {
        return profileRules.flatMap(profileRule => profileRule.rules.flatMap((rule, i) => ([
            {
                children: [ i * 2 + 1 ],
                cells: [
                    <Text key={ i } component={ TextVariants.a }>{ rule.title }</Text>,
                    rule.ref_id,
                    profileRule.profile,
                    rule.severity,
                    (rule.compliant ? <CheckCircleIcon style={ { color: '#92d400' } } /> :
                        <ExclamationCircleIcon style={ { color: '#a30000' } } />)
                ]
            },
            {
                isOpen: false,
                cells: [
                    {
                        title: <React.Fragment key={ i }>
                            <div id='rule-description'>
                                <b>Description</b>
                                <br />
                                <p>{ rule.description }</p>
                            </div>
                            <br />
                            <div id='rule-rationale'>
                                <b>Rationale</b>
                                <br />
                                <p>{ rule.rationale }</p>
                            </div>
                        </React.Fragment>,
                        colSpan: 5
                    }
                ]
            }]
        )));
    }

    setPage = (page) => {
        this.setState({
            page,
            openNodes: []
        });
    }

    setPerPage = (itemsPerPage) => {
        this.setState({
            itemsPerPage,
            openNodes: []
        });
    }

    currentRows = () => {
        const { page, itemsPerPage, rows } = this.state;
        return rows.slice(
            (page - 1) * itemsPerPage * 2,
            page * itemsPerPage * 2
        );
    }

    onItemSelect = (_event, key, selected) => {
        let { rows, page, itemsPerPage } = this.state;
        const firstIndex = (page - 1) * (itemsPerPage * 2);
        rows[firstIndex + Number(key)].selected = selected;
        this.setState({
            rows
        });
    }

    onExpandClick = (_event, _row, rowKey) => {
        let { rows, page, itemsPerPage, openNodes } = this.state;
        const activeRow = rows[(page - 1) * (itemsPerPage * 2) + Number(rowKey)];
        activeRow.active = !activeRow.active;
        if (!activeRow.active) {
            openNodes.splice(openNodes.indexOf(Number(rowKey) + 1), 1);
        } else {
            openNodes = [
                ...openNodes,
                Number(rowKey) + 1
            ];
        }

        this.setState({
            openNodes,
            rows
        });
    }

    selectedRules = () => {
        return this.state.rows.filter(row => row.selected).map(row => row.cells[1]);
    }

    render() {
        const currentRows = this.currentRows();
        const { loading } = this.props;
        return (
            <React.Fragment>
                <Grid gutter="sm">
                    <GridItem span={ 10 }>
                        <Input
                            id="search"
                            type="text"
                            style={ { width: '200px' } }
                        />{ ' ' }
                        <SearchIcon style={ { paddingTop: '4px' } } />
                    </GridItem>
                    <GridItem span={ 2 }>
                        { !loading && <ComplianceRemediationButton selectedRules={ this.selectedRules() } /> }
                    </GridItem>

                    <GridItem span={ 12 }>
                        <Table
                            variant="large"
                            header={ [ 'Rule', 'Reference ID', 'Policy', 'Severity', 'Passed' ] }
                            hasCheckbox
                            expandable
                            onItemSelect={ this.onItemSelect }
                            rows={ loading ? [ ...Array(10) ].map(() => ({
                                cells: [{
                                    title: <RowLoader />,
                                    colSpan: 5
                                }]
                            })) : currentRows.map((oneRow, key) => ({
                                ...oneRow,
                                ...oneRow.hasOwnProperty('isOpen') ?
                                    { isOpen: this.state.openNodes.indexOf(key) !== -1 } :
                                    {}
                            })
                            ) }
                            onExpandClick={ this.onExpandClick }
                            footer={ <Pagination
                                numberOfItems={ (this.state.rows.length - 2) / 2 }
                                onPerPageSelect={ this.setPerPage }
                                page={ this.state.page }
                                onSetPage={ this.setPage }
                                itemsPerPage={ this.state.itemsPerPage }
                            /> }
                        />
                    </GridItem>
                </Grid>
            </React.Fragment>
        );
    }
}

SystemRulesTable.propTypes = {
    profileRules: propTypes.array,
    loading: propTypes.bool
};

export default routerParams(SystemRulesTable);
