/* eslint-disable camelcase */
import './insights.scss';

import { BASE_FETCH_URL, FILTER_CATEGORIES as FC, IMPACT_LABEL, LIKELIHOOD_LABEL } from './Constants';
import React, { Component, Fragment } from 'react';
import { SortByDirection, Table, TableBody, TableHeader, cellWidth, fitContent, sortable } from '@patternfly/react-table';
import { flatten, sortBy } from 'lodash';
import { Button, Bullseye, Card, CardBody, Stack, StackItem, Tooltip, TooltipPosition, ToolbarItem, ClipboardCopy } from '@patternfly/react-core';
import { CheckCircleIcon, PficonSatelliteIcon, ExternalLinkAltIcon, AnsibeTowerIcon, TimesCircleIcon, CheckIcon, ChartSpikeIcon } from '@patternfly/react-icons';

import API from './Api';
import { DateFormat, InsightsLabel, PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import { List } from 'react-content-loader';
import MessageState from './MessageState';
import PropTypes from 'prop-types';
import { RemediationButton } from '@redhat-cloud-services/frontend-components-remediations';
import ReportDetails from './ReportDetails';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { connect } from 'react-redux';

class InventoryRuleList extends Component {
    state = {
        inventoryReportFetchStatus: 'pending',
        rows: [],
        cols: [
            { title: '' },
            { title: 'Description', transforms: [ sortable ] },
            { title: 'Added', transforms: [ sortable, cellWidth(15) ] },
            { title: 'Total risk', transforms: [ sortable ] },
            {
                title: <span>{AnsibeTowerIcon && <AnsibeTowerIcon size='md' />} Ansible</span>,
                transforms: [ sortable, fitContent ],
                dataLabel: 'Ansible'
            }
        ],
        sortBy: {},
        activeReports: [],
        kbaDetailsData: [],
        filters: {},
        searchValue: '',
        accountSettings: {},
        isSelected: false
    };

    componentDidMount() {
        this.fetchAccountSettings();
        this.fetchEntityRules();
    }

    capitalize = (string) => string[0].toUpperCase() + string.substring(1);

    async fetchAccountSettings() {
        try {
            const settingsFetch = (await API.get(`${BASE_FETCH_URL}account_setting/`, { credentials: 'include' })).data;
            this.setState({ accountSettings: settingsFetch });
        } catch (error) {
            console.warn(error, 'Account settings fetch failed.');
        }
    }

    async fetchEntityRules() {
        const { entity } = this.props;
        const { filters, searchValue, rows } = this.state;
        try {
            await insights.chrome.auth.getUser();
            const reportsFetch = (await API.get(`${BASE_FETCH_URL}system/${entity.id}/reports/`, { credentials: 'include' })).data;
            const activeRuleFirstReportsData = this.activeRuleFirst(reportsFetch);
            this.fetchKbaDetails(activeRuleFirstReportsData);
            this.setState({
                rows: this.buildRows(activeRuleFirstReportsData, {}, filters, rows, searchValue, true),
                inventoryReportFetchStatus: 'fulfilled',
                activeReports: activeRuleFirstReportsData
            });
        } catch (error) {
            this.setState({
                inventoryReportFetchStatus: 'failed'
            });
            console.warn(error, 'Entity recommendation fetch failed.');
        }

    }

    fetchKbaDetails = async (reportsData) => {
        const { filters, searchValue, rows } = this.state;
        const kbaIds = reportsData.map(({ rule }) => rule.node_id).filter(x => x);
        try {
            const kbaDetailsFetch = (await API.get(
                `https://access.redhat.com/hydra/rest/search/kcs?q=id:(${
                    kbaIds.join(` OR `)
                })&fl=view_uri,id,publishedTitle&rows=${
                    kbaIds.length
                }&redhat_client=$ADVISOR`,
                {},
                { credentials: 'include' }
            )).data.response.docs;
            this.setState({
                kbaDetailsData: kbaDetailsFetch,
                rows: this.buildRows(reportsData, kbaDetailsFetch, filters, rows, searchValue)
            });
        } catch (error) {
            console.error(error, 'KBA fetch failed.');
        }
    };

    activeRuleFirst = (activeReports) => {
        const { routerData } = this.props;
        const reports = [ ...activeReports ];
        const activeRuleIndex = routerData && (typeof(routerData.params) !== 'undefined') ?
            activeReports.findIndex(report => report.rule.rule_id === this.props.routerData.params.id)
            : -1;
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

    buildRows = (activeReports, kbaDetails, filters, rows, searchValue = '', kbaLoading = false) => {
        const builtRows = flatten(activeReports.map((value, key) => {
            console.error(activeReports);
            const rule = value.rule;
            const resolution = value.resolution;
            const kbaDetail = Object.keys(kbaDetails).length ? kbaDetails.filter(article => article.id === value.rule.node_id)[0] : {};
            const entity = rows.filter((rowVal, rowKey) => rowKey % 2 === 0 && rowVal.rule.rule_id === rule.rule_id && rowVal);
            const selected = entity.length ? entity[0].selected : false;
            const isOpen = rows.length ? (
                entity.length ? entity[0].isOpen : false
            ) : (
                key === 0 ? true : false
            );
            const reportRow = [
                {
                    rule,
                    resolution,
                    isOpen,
                    selected,
                    cells: [
                        {
                            title: <div>
                                {resolution.has_playbook ? <input
                                    aria-label='select-checkbox'
                                    type="checkbox"
                                    checked={!!selected}
                                    onChange={event => this.onSelect(event, !selected, rule)}
                                    className="pf-c-check"
                                /> : ''}
                            </div>
                        },
                        { title: <div> {rule.description}</div> },
                        {
                            title: <div key={key}>
                                <DateFormat date={rule.publish_date} type='relative' tooltipProps={{ position: TooltipPosition.bottom }} />
                            </div>
                        },
                        {
                            title: <div key={key} style={{ verticalAlign: 'top' }}>
                                <Tooltip key={key} position={TooltipPosition.bottom} content={<span>The <strong>likelihood</strong> that this will be
                                a problem is {LIKELIHOOD_LABEL[rule.likelihood]}. The <strong>impact</strong> of the problem would be
                                &nbsp;{IMPACT_LABEL[rule.impact.impact]} if it occurred.</span>}>
                                    <InsightsLabel value={rule.total_risk} />
                                </Tooltip>
                            </div >
                        },
                        {
                            title: <div className='ins-c-center-text' key={key}>
                                {resolution.has_playbook ?
                                    <CheckCircleIcon className='successColorOverride' />
                                    : 'No'}
                            </div>
                        }
                    ]
                },
                {
                    parent: key,
                    fullWidth: true,
                    cells: [{
                        title: <ReportDetails key={`child-${key}`} report={value} kbaDetail={kbaDetail} kbaLoading={kbaLoading} />
                    }]
                }
            ];

            const isValidSearchValue = searchValue.length === 0 || rule.description.toLowerCase().includes(searchValue.toLowerCase());
            const isValidFilterValue = Object.keys(filters).length === 0 || Object.keys(filters).map((key) => {
                const filterValues = filters[key];
                const rowValue = {
                    has_playbook: value.resolution.has_playbook,
                    publish_date: rule.publish_date,
                    total_risk: rule.total_risk,
                    category: rule.category.name
                };

                return filterValues.find(value => String(value) === String(rowValue[key]));
            }).every(x => x);

            return isValidSearchValue && isValidFilterValue ? reportRow : [];
        }));
        //must recalculate parent for expandable table content whenever the array size changes
        builtRows.forEach((row, index) => row.parent ? row.parent = index - 1 : null);

        return builtRows;
    };

    onKebabClick = (action) => {
        const { rows } = this.state;
        const isOpen = action === 'insights-expand-all';
        rows.map((row, key) => {
            if (row.hasOwnProperty('isOpen')) {
                row.isOpen = isOpen;
                isOpen && this.handleOnCollapse(null, key, isOpen);
            }
        });

        this.setState({ rows });
    };

    onSort = (_event, index, direction) => {
        const { activeReports, kbaDetailsData, filters, searchValue, rows } = this.state;
        const sortedReports = {
            2: sortBy(activeReports, [ result => result.rule.description ]),
            3: sortBy(activeReports, [ result => result.rule.publish_date ]),
            4: sortBy(activeReports, [ result => result.rule.total_risk ]),
            5: sortBy(activeReports, [ result => result.resolution.has_playbook ])
        };
        const sortedReportsDirectional = direction === SortByDirection.asc ? sortedReports[index] : sortedReports[index].reverse();
        this.setState({
            activeReports: sortedReportsDirectional,
            sortBy: {
                index,
                direction
            },
            rows: this.buildRows(sortedReportsDirectional, kbaDetailsData, filters, rows, searchValue)
        });
    };

    removeFilterParam = (param) => {
        const filter = { ...this.state.filters };
        delete filter[param];
        return filter;
    };

    onFilterChange = (param, values) => {
        const { filters, activeReports, kbaDetailsData, searchValue, rows } = this.state;
        const newFilters = values.length > 0 ? { ...filters, ...{ [param]: values } } : this.removeFilterParam(param);
        const builtRows = this.buildRows(activeReports, kbaDetailsData, newFilters, rows, searchValue);
        this.setState({ rows: builtRows, filters: newFilters });
    };

    onInputChange = (value) => {
        const { activeReports, kbaDetailsData, filters, rows } = this.state;
        const builtRows = this.buildRows(activeReports, kbaDetailsData, filters, rows, value);
        this.setState({ searchValue: value, rows: builtRows });
    };

    onSelect = (event, isSelected, rule) => {
        const { activeReports, kbaDetailsData, filters, rows, searchValue } = this.state;
        this.setState({
            rows: this.buildRows(
                activeReports, kbaDetailsData, filters,
                rows.map((oneRow) => oneRow.rule && oneRow.rule.rule_id === rule.rule_id ? { ...oneRow, selected: isSelected } : { ...oneRow }),
                searchValue
            )
        });
    };

    getSelectedItems = (rows) => rows.filter(entity => entity.selected);

    bulkSelect = (isSelected) => {
        const { activeReports, kbaDetailsData, filters, rows, searchValue } = this.state;
        this.setState({
            isSelected,
            rows: this.buildRows(
                activeReports, kbaDetailsData, filters,
                rows.map((row, index) => (
                    // We need to use mod 2 here to ignore children with no has_playbook param
                    index % 2 === 0 && row.resolution.has_playbook ? { ...row, selected: isSelected } : row
                )), searchValue
            )
        });
    }

    processRemediation = (selectedAnsibleRules) => {
        const playbookRows = selectedAnsibleRules.filter(r => r.resolution && r.resolution.has_playbook);
        const issues = playbookRows.map(
            r => ({ id: `advisor:${r.rule.rule_id}`, description: r.rule.description })
        );

        return issues.length ?
            { issues, systems: [ this.props.entity.id ] } :
            false;
    };

    buildFilterChips = (filters) => {
        const prunedFilters = Object.entries(filters);
        let chips = filters && prunedFilters.length > 0 ? prunedFilters.map(item => {
            const category = FC[item[0]];
            const chips = item[1].map(value => ({ name: category.values.find(values => values.value === String(value)).text, value }));
            return { category: this.capitalize(category.title), chips, urlParam: category.urlParam };

        })
            : [];
        this.state.searchValue.length > 0 &&
            (chips.push({ category: 'Description', chips: [{ name: this.state.searchValue, value: this.state.searchValue }] }));
        return chips;
    }

    onChipDelete = (event, itemsToRemove, isAll) => {
        const { filters, activeReports, kbaDetailsData, rows } = this.state;
        if (isAll) {
            const builtRows = this.buildRows(activeReports, kbaDetailsData, {}, rows, '');
            this.setState({ rows: builtRows, filters: {}, searchValue: '' });
        } else {
            itemsToRemove.map(item => {
                if (item.category === 'Description') {
                    const builtRows = this.buildRows(activeReports, kbaDetailsData, filters, rows, '');
                    this.setState({ rows: builtRows, searchValue: '' });
                } else {
                    this.onFilterChange(item.urlParam, filters[item.urlParam].filter(value => String(value) !== String(item.chips[0].value)));
                }
            });
        }
    }

    render() {
        const { inventoryReportFetchStatus, rows, cols, sortBy, filters, searchValue, activeReports, accountSettings, isSelected } = this.state;
        const { entity, systemProfile, addNotification } = this.props;
        const results = rows ? rows.length / 2 : 0;
        const satelliteManaged = systemProfile && systemProfile.satellite_managed || false; // system is managed by satellite
        const satelliteShowHosts = accountSettings.show_satellite_hosts || false; // setting to show satellite managed systems
        const hideResultsSatelliteManaged = !satelliteShowHosts && satelliteManaged;
        const selectedAnsibleRules = this.getSelectedItems(rows).filter(r => r.resolution && r.resolution.has_playbook);
        const selectedItemsLength = this.getSelectedItems(rows).length;
        const selectableItemsLength = rows.filter(r => r.resolution && r.resolution.has_playbook).length;
        const actions = [
            '', {
                label: 'Collapse all',
                onClick: () => this.onKebabClick('insights-collapse-all')
            }, {
                label: 'Expand all',
                onClick: () => this.onKebabClick('insights-expand-all')
            }
        ];

        const filterConfigItems = [{
            label: 'description',
            filterValues: {
                key: 'text-filter',
                onChange: (event, value) => this.onInputChange(value),
                value: searchValue
            }
        }, {
            label: FC.total_risk.title,
            type: FC.total_risk.type,
            id: FC.total_risk.urlParam,
            value: `checkbox-${FC.total_risk.urlParam}`,
            filterValues: {
                key: `${FC.total_risk.urlParam}-filter`,
                onChange: (event, values) => this.onFilterChange(FC.total_risk.urlParam, values),
                value: filters.total_risk,
                items: FC.total_risk.values
            }
        }, {
            label: FC.category.title,
            type: FC.category.type,
            id: FC.category.urlParam,
            value: `checkbox-${FC.category.urlParam}`,
            filterValues: {
                key: `${FC.category.urlParam}-filter`,
                onChange: (event, values) => this.onFilterChange(FC.category.urlParam, values),
                value: filters.category,
                items: FC.category.values
            }
        }, {
            label: FC.has_playbook.title,
            type: FC.has_playbook.type,
            id: FC.has_playbook.urlParam,
            value: `checkbox-${FC.has_playbook.urlParam}`,
            filterValues: {
                key: `${FC.has_playbook.urlParam}-filter`,
                onChange: (event, values) => this.onFilterChange(FC.has_playbook.urlParam, values),
                value: filters.has_playbook,
                items: FC.has_playbook.values
            }
        }];

        const bulkSelect = {
            items: [{
                title: 'Select none',
                onClick: () => this.bulkSelect(false)
            }, {
                title: 'Select all',
                onClick: () => this.bulkSelect(true)
            }],
            count: selectedItemsLength,
            checked: selectedItemsLength === selectableItemsLength,
            onSelect: () => this.bulkSelect(!isSelected)
        };

        const activeFiltersConfig = {
            filters: this.buildFilterChips(filters),
            onDelete: this.onChipDelete
        };

        return <Fragment>
            {inventoryReportFetchStatus === 'pending' ||
                (inventoryReportFetchStatus === 'fulfilled' && hideResultsSatelliteManaged) ||
                entity.insights_id === null ?
                <Fragment />
                :
                <PrimaryToolbar
                    actionsConfig={{ actions }}
                    bulkSelect={bulkSelect}
                    filterConfig={{ items: filterConfigItems }}
                    pagination={<React.Fragment> {results === 1 ? `${results} Recommendation` : `${results} Recommendations`} </React.Fragment>}
                    activeFiltersConfig={activeFiltersConfig}
                >
                    <ToolbarItem className="remediationButtonOverride">
                        <RemediationButton
                            isDisabled={selectedAnsibleRules.length === 0}
                            dataProvider={() => this.processRemediation(selectedAnsibleRules)}
                            onRemediationCreated={result => addNotification(result.getNotification())} >
                            {AnsibeTowerIcon && <AnsibeTowerIcon size='sm' className='ins-c-background__default' />} Remediate
                        </RemediationButton>
                    </ToolbarItem>
                </PrimaryToolbar>
            }
            {inventoryReportFetchStatus === 'pending' && (
                <Card>
                    <CardBody>
                        <List />
                    </CardBody>
                </Card>
            )}
            {inventoryReportFetchStatus === 'fulfilled' &&
                (hideResultsSatelliteManaged ?
                    <MessageState icon={PficonSatelliteIcon} title='Satellite managed system'
                        text={<span key='satellite managed system'>
                            Insights results can not be displayed for this host, as the &quot;Hide Satellite Managed Systems&quot; setting has been
                            enabled by an org admin.<br />For more information on this setting and how to modify it,
                            <a href='https://access.redhat.com/solutions/4281761' rel="noopener"> Please visit this Knowledgebase article &nbsp;
                                <ExternalLinkAltIcon />
                            </a>.</span>} />
                    :
                    (activeReports.length > 0 ?
                        <Fragment>
                            <Table aria-label={'rule-table'} onCollapse={this.handleOnCollapse} rows={rows} cells={cols} sortBy={sortBy}
                                canSelectAll={false} onSort={this.onSort}>
                                <TableHeader />
                                <TableBody />
                            </Table>
                            {results === 0 &&
                                <MessageState icon={TimesCircleIcon} title='No matching recommendations found'
                                    text={`This filter criteria matches no recommendations. Try changing your filter settings.`} />
                            }
                        </Fragment>
                        : entity.insights_id !== null ? <Card>
                            <CardBody>
                                <MessageState icon={CheckIcon} iconClass='ins-c-insights__check'
                                    title='No recommendations' text={`No known recommendations affect this system`} />
                            </CardBody>
                        </Card>
                            : <MessageState
                                iconClass='chartSpikeIconColor'
                                icon={ChartSpikeIcon}
                                title='Get started with Red Hat Insights'
                                text={<Bullseye>
                                    <Stack hasGutter>
                                        <StackItem>
                                            1. Install the client on the RHEL system.
                                            <ClipboardCopy>yum install insights-client</ClipboardCopy>
                                        </StackItem>
                                        <StackItem>
                                            2. Register the system to Red Hat Insights.
                                            <ClipboardCopy>insights-client --register</ClipboardCopy>
                                        </StackItem>
                                    </Stack>
                                </Bullseye>}>
                                <Button component="a" href="https://access.redhat.com/products/red-hat-insights#getstarted"
                                    target="_blank" variant="primary">
                                    Getting started documentation
                                </Button>
                            </MessageState>
                    ))
            }
            {inventoryReportFetchStatus === 'failed' && entity &&
                <MessageState icon={TimesCircleIcon} title='Error getting recommendations'
                    text={entity ? `There was an error fetching recommendations for this entity. Refresh your page to try again.`
                        : `This entity can not be found or might no longer be registered to Red Hat Insights.`} />

            }
        </Fragment>;
    }
}

InventoryRuleList.propTypes = {
    entity: PropTypes.object,
    addNotification: PropTypes.func,
    routerData: PropTypes.object,
    systemProfile: PropTypes.object
};

const mapStateToProps = (state) => ({
    entity: state.entityDetails.entity,
    routerData: state.routerData,
    systemProfile: state.systemProfileStore ? state.systemProfileStore.systemProfile : {}
});

const mapDispatchToProps = dispatch => ({
    addNotification: data => dispatch(addNotification(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InventoryRuleList);
