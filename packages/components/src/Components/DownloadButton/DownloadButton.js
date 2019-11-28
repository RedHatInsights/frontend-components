import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownItem } from '@patternfly/react-core';
import { ExportIcon, IconSize } from '@patternfly/react-icons';
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

    render() {
        const { isOpen } = this.state;
        const { extraItems, onSelect, ...props } = this.props;
        return (
            <Dropdown
                { ...props }
                isPlain
                onSelect={ this.onSelect }
                toggle={
                    <DropdownToggle
                        iconComponent={null}
                        onToggle={ this.onToggle }
                    >
                        <ExportIcon size="sm" />
                    </DropdownToggle>
                }
                isOpen={ isOpen }
                dropdownItems={ [
                    <DropdownItem key="download-csv" component="button" onClick={ event => onSelect(event, 'csv') }>Export to CSV</DropdownItem>,
                    <DropdownItem key="download-json" component="button" onClick={ event => onSelect(event, 'json') }>Export to JSON</DropdownItem>,
                    ...extraItems
                ] }
            />
        );
    }
}

DownloadButton.propTypes = {
    extraItems: PropTypes.arrayOf(PropTypes.node),
    onSelect: PropTypes.func
};
DownloadButton.defaultProps = {
    extraItems: [],
    onSelect: () => undefined
};

export default DownloadButton;
