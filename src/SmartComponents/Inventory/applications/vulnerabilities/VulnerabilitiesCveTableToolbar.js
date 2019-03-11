/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Checkbox, Form, FormGroup, FormSelect, FormSelectOption, Grid, GridItem } from '@patternfly/react-core';
import routerParams from '../../../../Utilities/RouterParams';
import { SimpleTableFilter } from '../../../../PresentationalComponents/SimpleTableFilter';
import { DownloadButton } from '../../../../PresentationalComponents/DownloadButton';
import { TableToolbar } from '../../../../PresentationalComponents/TableToolbar';
import debounce from 'lodash/debounce';
import propTypes from 'prop-types';
import RemediationButton from '../../../Remediations/RemediationButton';
import { connect } from 'react-redux';
import { addNotification } from '../../../Notifications';

const CVSSOptions = [
    { value: 'all', label: 'CVSS Base Score: All', disabled: false, from: '', to: '' },
    { value: 'from0less3', label: 'CVSS < 3.0', disabled: false, from: '', to: 2.999 },
    { value: 'from3less7', label: 'CVSS >= 3.0 and CVSS < 7.0', disabled: false, from: 3, to: 6.999 },
    { value: 'from7to10', label: 'CVSS >= 7.0 and CVSS <= 10.0', disabled: false, from: 7, to: 10 }
];

class VulnerabilitiesCveTableToolbar extends Component {
    state = {
        defaultConfig: {
            filter: '',
            cvss_score: 'all',
            show_all: 'False'
        },
        toolbarConfig: {}
    };
    changeFilterValue = debounce(
        value =>
            this.setState(
                {
                    toolbarConfig: { ...this.state.toolbarConfig, filter: value }
                },
                this.apply
            ),
        400
    );

    apply = () => this.props.apply(this.state.toolbarConfig);

    changeCVSSValue = (value, options) => {
        const target = options.find(item => item.value === value);
        this.setState({ toolbarConfig: { ...this.state.toolbarConfig, cvss_from: target.from, cvss_to: target.to }}, this.apply);
    };

    changeCheckboxValue = value => {
        this.setState({ toolbarConfig: { ...this.state.toolbarConfig, show_all: !value }}, this.apply);
    };

    getCVSSValue = options => {
        const option = options.find(item => item.from === this.state.toolbarConfig.cvss_from && item.to === this.state.toolbarConfig.cvss_to);
        return option ? option.value : options[0].value;
    };

    remediationProvider = () => {
        if (!this.props.selectedCves || this.props.selectedCves.size === 0) {
            return false;
        }

        return {
            issues: [ ...this.props.selectedCves ].map((cve) => ({ id: `vulnerabilities:${cve}`, description: cve })),
            systems: [ this.props.entity.id ]
        };
    }

    render() {
        const { showAllCheckbox, downloadReport, totalNumber, showRemediationButton } = this.props;
        return (
            <TableToolbar>
                <Grid className="cvetable-toolbar" gutter={ 'md' }>
                    <GridItem span={ 3 }>
                        <SimpleTableFilter
                            onFilterChange={ value => this.changeFilterValue(value) }
                            buttonTitle={ null }
                            placeholder="Find a CVE…"
                        />
                    </GridItem>
                    <GridItem span={ 3 }>
                        <Form>
                            <FormGroup fieldId="cvssScore">
                                <FormSelect
                                    id="cvssScore"
                                    onChange={ value => this.changeCVSSValue(value, CVSSOptions) }
                                    value={ this.getCVSSValue(CVSSOptions) }
                                >
                                    { CVSSOptions.map((option, index) => (
                                        <FormSelectOption isDisabled={ option.disabled }
                                            key={ index } value={ option.value } label={ option.label }
                                        />
                                    )) }
                                </FormSelect>
                            </FormGroup>
                        </Form>
                    </GridItem>
                    <GridItem span={ 1 } />
                    <GridItem span={ 3 }>
                        { showAllCheckbox && (
                            <React.Fragment>
                                <br />
                                <Checkbox
                                    label="Hide CVEs that do not affect my inventory"
                                    isChecked={ !this.state.toolbarConfig.show_all }
                                    onChange={ state => this.changeCheckboxValue(state) }
                                    aria-label="hide CVEs checkbox"
                                    id="toolbar-cves-hide-check"
                                />
                            </React.Fragment>
                        )
                        }
                        {
                            showRemediationButton &&
                                <RemediationButton
                                    dataProvider={ this.remediationProvider }
                                    isDisabled={ this.remediationProvider() === false }
                                    onRemediationCreated={ result => this.props.addNotification(result.getNotification()) }
                                />
                        }
                    </GridItem>
                    <GridItem span={ 1 } />
                    <GridItem span={ 1 }>
                        <DownloadButton onSelect={ downloadReport } />
                    </GridItem>
                </Grid>
            </TableToolbar>
        );
    }
}

VulnerabilitiesCveTableToolbar.propTypes = {
    CVETable: propTypes.any,
    apply: propTypes.func,
    showAllCheckbox: propTypes.bool,
    showRemediationButton: propTypes.bool,
    totalNumber: propTypes.number,
    downloadReport: propTypes.func,
    cves: propTypes.any,
    entity: propTypes.object,
    addNotification: propTypes.func.isRequired,
    selectedCves: propTypes.any
};

VulnerabilitiesCveTableToolbar.defaultProps = {
    showAllCheckbox: false,
    showRemediationButton: false,
    totalNumber: 0,
    apply: () => undefined,
    downloadReport: () => undefined
};

export default connect(
    null,
    (dispatch) => ({
        addNotification: notification => dispatch(addNotification(notification))
    })
)(routerParams(VulnerabilitiesCveTableToolbar));
