import { Dropdown, DropdownItem, DropdownToggle, Tooltip } from '@patternfly/react-core';
import React, { Component } from 'react';

import { ExportIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

class DownloadButton extends Component {
    state = {
        isOpen: false
    }

    onToggle = (isOpen) => {
        this.setState({
            isOpen
        });
    }

    onSelect = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    conditionallyTooltip = (children) => {
        const { tooltipText } = this.props;
        return <React.Fragment>
            {tooltipText ? <Tooltip content={tooltipText}>
                {children}
            </Tooltip> : children}
        </React.Fragment>;
    };

    render() {
        const { isOpen } = this.state;
        const { extraItems, onSelect, isDisabled, tooltipText, ...props } = this.props;
        return <React.Fragment>
            {this.conditionallyTooltip(<Dropdown
                { ...props }
                isPlain
                onSelect={ this.onSelect }
                toggle={
                    <DropdownToggle
                        toggleIndicator={null}
                        onToggle={ this.onToggle }
                        isDisabled={isDisabled}
                        ouiaId="Export"
                    >
                        <ExportIcon size="sm" />
                    </DropdownToggle>
                }
                isOpen={ isOpen }
                ouiaId="Export"
                dropdownItems={ [
                    <DropdownItem key="download-csv" ouiaId="DownloadCSV" component="button" onClick={ event => onSelect(event, 'csv') } isDisabled={isDisabled}>
                        Export to CSV</DropdownItem>,
                    <DropdownItem key="download-json" ouiaId="DownloadJSON" component="button" onClick={ event => onSelect(event, 'json') } isDisabled={isDisabled}>
                        Export to JSON</DropdownItem>,
                    ...extraItems
                ] }
            />)}
        </React.Fragment>;
    }
}

DownloadButton.propTypes = {
    extraItems: PropTypes.arrayOf(PropTypes.node),
    tooltipText: PropTypes.node,
    onSelect: PropTypes.func,
    isDisabled: PropTypes.bool
};
DownloadButton.defaultProps = {
    extraItems: [],
    onSelect: () => undefined
};

export default DownloadButton;
