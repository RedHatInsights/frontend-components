/* eslint-disable camelcase */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { List } from 'react-content-loader';
import {
    Button,
    ButtonVariant,
    Card,
    CardBody,
    Dropdown,
    DropdownItem,
    DropdownPosition,
    InputGroup,
    KebabToggle,
    TextInput,
    ToolbarGroup,
    ToolbarItem
} from '@patternfly/react-core';
import { CheckIcon, SearchIcon, TimesCircleIcon } from '@patternfly/react-icons';
import { cellWidth, sortable, SortByDirection, Table, TableBody, TableHeader } from '@patternfly/react-table';
import { filter, flatten, sortBy } from 'lodash';
import { global_success_color_200 } from '@patternfly/react-tokens';
import { withRouter } from 'react-router-dom';
import RemediationButton from '@redhat-cloud-services/frontend-components-remediations/RemediationButton';
import moment from 'moment';
import { Battery, FilterDropdown, TableToolbar } from '@redhat-cloud-services/frontend-components';

import './insights.scss';
import ReportDetails from './ReportDetails';
import { ANSIBLE_ICON, FILTER_CATEGORIES, SYSTEM_FETCH_URL } from './Constants';
import MessageState from './MessageState';

class InventoryRuleList extends Component {
    state = {
        inventoryReportFetchStatus: 'pending',
        rows: [],
        cols: [
            { title: 'Description', transforms: [ sortable ]},
            { title: 'Added', transforms: [ sortable, cellWidth(15) ]},
            { title: 'Total risk', transforms: [ sortable ]},
            { title: 'Risk of change', transforms: [ sortable ]},
            { title: <span className='ansibleCol'>{ ANSIBLE_ICON } Ansible</span>, transforms: [ sortable ]}
        ],
        remediation: false,
        isKebabOpen: false,
        sortBy: {},
        activeReports: [],
        kbaDetailsData: [],
        filters: {},
        searchValue: ''
    };

    componentDidMount () {
        this.fetchEntityRules();
    }

    processRemediation (systemId, reports) {
        const issues = reports.filter(r => r.resolution.has_playbook).map(
            r => ({ id: `advisor:${r.rule.rule_id}`, description: r.rule.description })
        );

        return issues.length ?
            { issues, systems: [ systemId ]} :
            false;
    }

    async fetchEntityRules () {
        const { entity } = this.props;
        const { filters, searchValue } = this.state;
        try {
            await insights.chrome.auth.getUser();
            const reportsFetch = await fetch(`${SYSTEM_FETCH_URL}${entity.id}/reports/`, { credentials: 'include' });
            const reportsData = await reportsFetch.json();
            const kbaIds = reportsData.map(report => report.rule.node_id).filter(x => x).join(` OR `);
            const kbaDetailsFetch = await fetch(`https://access.redhat.com/rs/search?q=id:(${kbaIds})&fl=view_uri,id,publishedTitle`,
                { credentials: 'include' });
            const kbaDetailsData = await kbaDetailsFetch.json();
            this.setState({
                rows: this.buildRows(this.activeRuleFirst(reportsData), kbaDetailsData.response.docs, filters, searchValue),
                inventoryReportFetchStatus: 'fulfilled',
                remediation: this.processRemediation(entity.id, reportsData),
                activeReports: reportsData,
                kbaDetailsData: kbaDetailsData.response.docs
            });
        } catch (error) {
            this.setState({
                inventoryReportFetchStatus: 'failed'
            });
            console.warn(error, 'Entity rules fetch failed.');
        }
    }

    activeRuleFirst = (activeReports) => {
        const reports = [ ...activeReports ];
        const activeRuleIndex = activeReports.findIndex(report => report.rule.rule_id === this.props.match.params.id);
        const activeReport = reports.splice(activeRuleIndex, 1);

        return activeRuleIndex !== -1 ? [ activeReport[0], ...reports ] : activeReports;
    };

    handleOnCollapse = (event, rowId, isOpen) => {
        const rows = [ ...this.state.rows ];
        rows[rowId] = { ...rows[rowId], isOpen };
        this.setState({
            rows
        });
    };

    buildRows = (activeReports, kbaDetails, filters, searchValue) => {
        const rows = flatten(activeReports.map((value, key) => {
            const rule = value.rule;
            const kbaDetail = kbaDetails.filter(article => article.id === value.rule.node_id)[0] || {};
            const reportRow = [
                {
                    isOpen: true,
                    cells: [
                        { title: <div> { rule.description }</div> },
                        {
                            title: <div key={ key }>
                                { moment(rule.publish_date).fromNow() }
                            </div>
                        },
                        {
                            title: <div className='pf-m-center' key={ key } style={ { verticalAlign: 'top' } }>
                                <Battery
                                    label='Total risk'
                                    labelHidden
                                    severity={ rule.total_risk }
                                />
                            </div>
                        }, {
                            title: <div className='pf-m-center' key={ key } style={ { verticalAlign: 'top' } }>
                                <Battery
                                    label='Risk of change'
                                    labelHidden
                                    severity={ value.resolution.resolution_risk.risk }
                                />
                            </div>
                        },
                        {
                            title: <div className='pf-m-center ' key={ key }>
                                { value.resolution.has_playbook &&
                                <CheckIcon className='successColorOverride'/> }
                            </div>
                        }
                    ]
                },
                {
                    parent: key,
                    fullWidth: true,
                    cells: [{
                        title: <ReportDetails key={ `child-${key}` } report={ value } kbaDetail={ kbaDetail }/>
                    }]
                }
            ];

            const isValidSearchValue = searchValue.length === 0 || rule.description.search(new RegExp(searchValue, 'i')) !== -1;
            const isValidFilterValue = Object.keys(filters).length === 0 || Object.keys(filters).map((key) => {
                const filterValues = filters[key];
                const rowValue = {
                    has_playbook: value.resolution.has_playbook,
                    risk: value.resolution.resolution_risk.risk,
                    publish_date: rule.publish_date,
                    total_risk: rule.total_risk
                };

                return filterValues.search(rowValue[key]) !== -1;
            }).every(x => x);

            return isValidSearchValue && isValidFilterValue ? reportRow : [];
        }));
        //must recalculate parent for expandable table content whenever the array size changes
        rows.forEach((row, index) => row.parent ? row.parent = index - 1 : null);

        return rows;
    };

    onKebabToggle = isOpen => {
        this.setState({
            isKebabOpen: isOpen
        });
    };

    onKebabSelect = event => {
        const { rows } = this.state;
        const isOpen = event.target.id === 'insights-expand-all';
        rows.map((row, key) => {
            if (row.hasOwnProperty('isOpen')) {
                row.isOpen = isOpen;
                isOpen && this.handleOnCollapse(null, key, isOpen);
            }
        });

        this.setState({
            isKebabOpen: !this.state.isKebabOpen
        });
    };

    buildKebab = () => {
        const { isKebabOpen } = this.state;
        return <Dropdown
            onToggle={ this.onKebabToggle }
            onSelect={ this.onKebabSelect }
            position={ DropdownPosition.right }
            toggle={ <KebabToggle onToggle={ this.onKebabToggle }/> }
            isOpen={ isKebabOpen }
            isPlain
            dropdownItems={ [
                <DropdownItem component='button' key='collapse' id='insights-collapse-all'>
                    Collapse all
                </DropdownItem>,
                <DropdownItem component='button' key='expand' id='insights-expand-all'>
                    Expand all
                </DropdownItem>
            ] }
        />;
    };

    onSort = (_event, index, direction) => {
        const { activeReports, kbaDetailsData, filters, searchValue } = this.state;
        const sortedReports = {
            1: sortBy(activeReports, [ result => result.rule.description ]),
            2: sortBy(activeReports, [ result => result.rule.publish_date ]),
            3: sortBy(activeReports, [ result => result.rule.total_risk ]),
            4: sortBy(activeReports, [ result => result.resolution.resolution_risk.risk ]),
            5: sortBy(activeReports, [ result => result.resolution.has_playbook ])
        };

        let sortedReportsDirectional = direction === SortByDirection.asc ? sortedReports[index] : sortedReports[index].reverse();
        this.setState({
            sortBy: {
                index,
                direction
            },
            rows: this.buildRows(sortedReportsDirectional, kbaDetailsData, filters, searchValue)
        });
    };

    onFilterChange = (key, value, type) => {
        const { filters, activeReports, kbaDetailsData, searchValue } = this.state;
        let newFilter;
        if (type) {
            newFilter = filters[key] ? { [key]: `${filters[key]},${value}` } : { [key]: `${value}` };
        } else {
            newFilter = { [key]: filters[key].split(',').filter(item => String(item) !== String(value)).join(',') };
            if (!newFilter[key].length) {
                delete filters[key];
                delete newFilter[key];
            }
        }

        const rows = this.buildRows(activeReports, kbaDetailsData, { ...filters, ...newFilter }, searchValue);
        this.setState({
            filters: { ...filters, ...newFilter },
            rows
        });
    };

    onInputChange = (value) => {
        const { activeReports, kbaDetailsData, filters } = this.state;
        const rows = this.buildRows(activeReports, kbaDetailsData, filters, value);
        this.setState({ searchValue: value, rows });
    };

    render () {
        const { remediation, inventoryReportFetchStatus, rows, cols, sortBy, filters, searchValue, activeReports } = this.state;
        const results = rows ? rows.length / 2 : 0;
        return <Fragment>
            { inventoryReportFetchStatus === 'pending' ||
            inventoryReportFetchStatus === 'fulfilled' &&
            <TableToolbar className='pf-u-justify-content-space-between'>
                <ToolbarGroup>
                    <ToolbarItem className="pf-u-mr-md">
                        <InputGroup>
                            <TextInput name='search-input' id='inventory-insights-search-input' type='search' value={ searchValue }
                                aria-label='inventory-insights-search-input' placeholder='Find a rule...' onChange={ this.onInputChange }
                            />
                            <Button variant={ ButtonVariant.tertiary } aria-label='search button for search input'>
                                <SearchIcon/>
                            </Button>
                        </InputGroup>
                    </ToolbarItem>
                    <ToolbarItem className="pf-u-mr-md">
                        <FilterDropdown
                            filters={ filters }
                            addFilter={ this.onFilterChange }
                            removeFilter={ this.onFilterChange }
                            filterCategories={ FILTER_CATEGORIES }
                        />
                    </ToolbarItem>
                    <ToolbarItem className="pf-u-mr-md">
                        <RemediationButton
                            isDisabled={ !remediation }
                            dataProvider={ () => remediation }
                            onRemediationCreated={ result => this.props.addNotification(result.getNotification()) }/>
                    </ToolbarItem>
                    <ToolbarItem>{ this.buildKebab() }</ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup>
                    <ToolbarItem>
                        { results === 1 ? `${results} rule` : `${results} rules` }
                    </ToolbarItem>
                </ToolbarGroup>
            </TableToolbar> }
            { inventoryReportFetchStatus === 'pending' && (
                <Card>
                    <CardBody>
                        <List/>
                    </CardBody>
                </Card>
            ) }
            { inventoryReportFetchStatus === 'fulfilled' && (activeReports.length > 0 ?
                <Fragment><Table aria-label={ 'rule-table' } onCollapse={ this.handleOnCollapse } rows={ rows } cells={ cols } sortBy={ sortBy }
                    onSort={ this.onSort }>
                    <TableHeader/>
                    <TableBody/>
                </Table>
                { results === 0 &&
                        <MessageState icon={ TimesCircleIcon } title='No matching systems found'
                            text={ `This filter criteria matches no rules. Try changing your filter settings.` }/>
                }
                </Fragment>
                :
                <Card>
                    <CardBody>
                        <MessageState icon={ CheckIcon } iconStyle={ { color: global_success_color_200.value } } title='No rule hits'
                            text={ `No known rules affect this system` }/>
                    </CardBody></Card>
            ) }
            { inventoryReportFetchStatus === 'failed' && this.props.entity &&
            <MessageState icon={ TimesCircleIcon } title='Error getting rules'
                text={ this.props.entity ? `There was an error fetching rules list for this entity. Refresh your page to try again.`
                    : `This entity can not be found or might no longer be registered to Red Hat Insights.` }/>

            }
        </Fragment>;
    }
}

InventoryRuleList.propTypes = {
    entity: PropTypes.object,
    addNotification: PropTypes.func,
    match: PropTypes.object
};

const mapStateToProps = ({ entityDetails: { entity }}) => ({
    entity
});

const mapDispatchToProps = dispatch => ({
    addNotification: data => dispatch(addNotification(data))
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(InventoryRuleList));
