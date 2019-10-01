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
import { CheckIcon, ExternalLinkAltIcon, SearchIcon, TimesCircleIcon, PficonSatelliteIcon, AnsibeTowerIcon } from '@patternfly/react-icons';
import { cellWidth, sortable, SortByDirection, Table, TableBody, TableHeader } from '@patternfly/react-table';
import { flatten, sortBy } from 'lodash';
import { global_success_color_200, global_BackgroundColor_100 } from '@patternfly/react-tokens';
import RemediationButton from '@redhat-cloud-services/frontend-components-remediations/RemediationButton';
import moment from 'moment';
import { Battery, FilterDropdown, TableToolbar } from '@redhat-cloud-services/frontend-components';

import './insights.scss';
import ReportDetails from './ReportDetails';
import { FILTER_CATEGORIES, BASE_FETCH_URL } from './Constants';
import MessageState from './MessageState';

class InventoryRuleList extends Component {
    state = {
        inventoryReportFetchStatus: 'pending',
        rows: [],
        cols: [
            { title: 'Description', transforms: [ sortable ] },
            { title: 'Added', transforms: [ sortable, cellWidth(15) ] },
            { title: 'Total risk', transforms: [ sortable ] },
            { title: 'Risk of change', transforms: [ sortable ] },
            { title: <span className='ansibleCol'>
                { AnsibeTowerIcon && <AnsibeTowerIcon size='md' /> } Ansible
            </span>, transforms: [ sortable ] }
        ],
        isKebabOpen: false,
        sortBy: {},
        activeReports: [],
        kbaDetailsData: [],
        filters: {},
        searchValue: '',
        accountSettings: {}
    };

    componentDidMount() {
        this.fetchAccountSettings();
        this.fetchEntityRules();
    }

    async fetchAccountSettings() {
        try {
            const settingsFetch = await fetch(`${BASE_FETCH_URL}account_setting`, { credentials: 'include' });
            const accountSettings = await settingsFetch.json();
            this.setState({ accountSettings });
        } catch (error) {
            console.warn(error, 'Account settings fetch failed.');
        }
    }

    async fetchEntityRules() {
        const { entity } = this.props;
        const { filters, searchValue } = this.state;
        try {
            await insights.chrome.auth.getUser();
            const reportsFetch = await fetch(`${BASE_FETCH_URL}system/${entity.id}/reports/`, { credentials: 'include' });
            const reportsData = await reportsFetch.json();
            const activeRuleFirstReportsData = this.activeRuleFirst(reportsData);
            this.fetchKbaDetails(activeRuleFirstReportsData);
            this.setState({
                rows: this.buildRows(activeRuleFirstReportsData, {}, filters, searchValue, true),
                inventoryReportFetchStatus: 'fulfilled',
                activeReports: activeRuleFirstReportsData
            });
        } catch (error) {
            this.setState({
                inventoryReportFetchStatus: 'failed'
            });
            console.warn(error, 'Entity rules fetch failed.');
        }
    }

    fetchKbaDetails = async (reportsData) => {
        const { filters, searchValue } = this.state;
        const kbaIds = reportsData.map(report => report.rule.node_id).filter(x => x).join(` OR `);
        const kbaDetailsFetch = await fetch(`https://access.redhat.com/rs/search?q=id:(${kbaIds})&fl=view_uri,id,publishedTitle`,
            { credentials: 'include' });
        const kbaDetailsData = (await kbaDetailsFetch.json()).response.docs;
        this.setState({
            kbaDetailsData,
            rows: this.buildRows(reportsData, kbaDetailsData, filters, searchValue)

        });
    };

    activeRuleFirst = (activeReports) => {
        const reports = [ ...activeReports ];
        const activeRuleIndex = activeReports.findIndex(report => report.rule.rule_id === this.props.routerData.params.id);
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

    buildRows = (activeReports, kbaDetails, filters, searchValue, kbaLoading = false) => {
        const rows = flatten(activeReports.map((value, key) => {
            const rule = value.rule;
            const resolution = value.resolution;
            const kbaDetail = Object.keys(kbaDetails).length ? kbaDetails.filter(article => article.id === value.rule.node_id)[0] : {};
            const reportRow = [
                {
                    rule,
                    resolution,
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
                                    severity={ resolution.resolution_risk.risk }
                                />
                            </div>
                        },
                        {
                            title: <div className='pf-m-center ' key={ key }>
                                { resolution.has_playbook &&
                                    <CheckIcon className='successColorOverride' /> }
                            </div>
                        }
                    ]
                },
                {
                    parent: key,
                    fullWidth: true,
                    cells: [{
                        title: <ReportDetails key={ `child-${key}` } report={ value } kbaDetail={ kbaDetail } kbaLoading={ kbaLoading } />
                    }]
                }
            ];

            const isValidSearchValue = searchValue.length === 0 || rule.description.toLowerCase().includes(searchValue.toLowerCase());
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

    onKebabClick = action => {
        const { rows } = this.state;
        const isOpen = action === 'insights-expand-all';
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
            position={ DropdownPosition.right }
            toggle={ <KebabToggle onToggle={ this.onKebabToggle } /> }
            isOpen={ isKebabOpen }
            isPlain
            dropdownItems={ [
                <DropdownItem component='button' key='collapse' onClick={ () => this.onKebabClick('insights-collapse-all') } >
                    Collapse all
                </DropdownItem>,
                <DropdownItem component='button' key='expand' onClick={  () => this.onKebabClick('insights-expand-all') }>
                    Expand all
                </DropdownItem>
            ] }
        />;
    };

    onSort = (_event, index, direction) => {
        const { activeReports, kbaDetailsData, filters, searchValue } = this.state;
        const sortedReports = {
            2: sortBy(activeReports, [ result => result.rule.description ]),
            3: sortBy(activeReports, [ result => result.rule.publish_date ]),
            4: sortBy(activeReports, [ result => result.rule.total_risk ]),
            5: sortBy(activeReports, [ result => result.resolution.resolution_risk.risk ]),
            6: sortBy(activeReports, [ result => result.resolution.has_playbook ])
        };
        const sortedReportsDirectional = direction === SortByDirection.asc ? sortedReports[index] : sortedReports[index].reverse();
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

    onSelect = (event, isSelected, rowId) => {
        this.setState({
            rows: this.state.rows.map((oneRow, rowKey) => (rowId === -1 || rowKey === rowId) ? { ...oneRow, selected: isSelected } : { ...oneRow })
        });
    };

    getSelectedItems = (rows) => rows.filter(entity => entity.selected);

    processRemediation = () => {
        const { rows } = this.state;
        const selectedRows = this.getSelectedItems(rows);
        const playbookRows = selectedRows.filter(r => r.resolution && r.resolution.has_playbook);
        const issues = playbookRows.map(
            r => ({ id: `advisor:${r.rule.rule_id}`, description: r.rule.description })
        );

        return issues.length ?
            { issues, systems: [ this.props.entity.id ] } :
            false;
    };

    render() {
        const { inventoryReportFetchStatus, rows, cols, sortBy, filters, searchValue, activeReports, accountSettings } = this.state;
        const results = rows ? rows.length / 2 : 0;
        const satelliteManaged = this.props.entity.satellite_id || false; // system is managed by satellite
        const satelliteShowHosts = accountSettings.show_satellite_hosts || false; // setting to show satellite managed systems
        const hideResultsSatelliteManaged = !satelliteShowHosts && satelliteManaged;

        return <Fragment>
            { inventoryReportFetchStatus === 'pending' ||
                (inventoryReportFetchStatus === 'fulfilled' && hideResultsSatelliteManaged) ?
                <></>
                : <TableToolbar className='pf-u-justify-content-space-between'>
                    <ToolbarGroup>
                        <ToolbarItem className="pf-u-mr-md">
                            <InputGroup>
                                <TextInput name='search-input' id='inventory-insights-search-input' type='search' value={ searchValue }
                                    aria-label='inventory-insights-search-input' placeholder='Find a rule...' onChange={ this.onInputChange }
                                />
                                <Button variant={ ButtonVariant.tertiary } aria-label='search button for search input'>
                                    <SearchIcon />
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
                                isDisabled={ this.getSelectedItems(rows).length === 0 }
                                dataProvider={ this.processRemediation }
                                onRemediationCreated={ result => this.props.addNotification(result.getNotification()) } >
                                { AnsibeTowerIcon && <AnsibeTowerIcon size='sm' color={ global_BackgroundColor_100.value } /> } Remediation
                            </RemediationButton>
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
                        <List />
                    </CardBody>
                </Card>
            ) }
            { inventoryReportFetchStatus === 'fulfilled' &&
                (hideResultsSatelliteManaged ?
                    <MessageState icon={ PficonSatelliteIcon } title='Satellite managed system'
                        text={ <span key='satellite managed system'>Insights results can not be displayed for this host, as the &quot;Hide
                    Satellite Managed Systems&quot; setting has been enabled by an org admin.<br />For more information on this setting
                                and how to modify it,
                        <a href='https://access.redhat.com/solutions/4281761' rel="noopener"> Please visit this Knowledgebase Article
                            <ExternalLinkAltIcon />
                        </a>.</span> } />
                    :
                    (activeReports.length > 0 ?
                        <Fragment>
                            <Table aria-label={ 'rule-table' } onCollapse={ this.handleOnCollapse } rows={ rows } cells={ cols } sortBy={ sortBy }
                                onSort={ this.onSort }
                                onSelect={ this.onSelect }>
                                <TableHeader />
                                <TableBody />
                            </Table>
                            { results === 0 &&
                                <MessageState icon={ TimesCircleIcon } title='No matching systems found'
                                    text={ `This filter criteria matches no rules. Try changing your filter settings.` } />
                            }
                        </Fragment>
                        :
                        <Card>
                            <CardBody>
                                <MessageState icon={ CheckIcon } iconStyle={ { color: global_success_color_200.value } } title='No rule hits'
                                    text={ `No known rules affect this system` } />
                            </CardBody>
                        </Card>
                    ))
            }
            { inventoryReportFetchStatus === 'failed' && this.props.entity &&
                <MessageState icon={ TimesCircleIcon } title='Error getting rules'
                    text={ this.props.entity ? `There was an error fetching rules list for this entity. Refresh your page to try again.`
                        : `This entity can not be found or might no longer be registered to Red Hat Insights.` } />

            }
        </Fragment>;
    }
}

InventoryRuleList.propTypes = {
    entity: PropTypes.object,
    addNotification: PropTypes.func,
    routerData: PropTypes.object
};

const mapStateToProps = (state) => ({
    entity: state.entityDetails.entity,
    routerData: state.routerData
});

const mapDispatchToProps = dispatch => ({
    addNotification: data => dispatch(addNotification(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InventoryRuleList);
