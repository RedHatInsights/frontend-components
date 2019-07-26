/* eslint-disable camelcase */
import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core';
import propTypes from 'prop-types';
import React, { Component } from 'react';

class DownloadReportKebab extends Component {
    state = { isKebabOpen: false };

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.isKebabOpen !== this.state.isKebabOpen) {
            return true;
        }

        return false;
    }

    onKebabToggle = isKebabOpen => {
        this.setState({
            isKebabOpen
        });
    };

    onKebabSelect = event => {
        this.setState({
            isKebabOpen: !this.state.isKebabOpen
        });
    };

    render() {
        const { downloadReport } = this.props;
        return (
            <div>
                <Dropdown
                    onSelect={ this.onKebabSelect }
                    toggle={ <KebabToggle onToggle={ this.onKebabToggle } /> }
                    isOpen={ this.state.isKebabOpen }
                    isPlain
                    dropdownItems={ [
                        <DropdownItem key="json" component="button" onClick={ () => downloadReport('json') }>
                            Export as JSON
                        </DropdownItem>,
                        <DropdownItem key="csv" component="button" onClick={ () => downloadReport('csv') }>
                            Export as CSV
                        </DropdownItem>
                    ] }
                />
            </div>
        );
    }
}

DownloadReportKebab.propTypes = {
    showAllCheckbox: propTypes.bool,
    downloadReport: propTypes.func,
    showStatusList: propTypes.bool,
    statusList: propTypes.object,
    apply: propTypes.func,
    location: propTypes.object,
    fetchStatusList: propTypes.func
};

export default DownloadReportKebab;
