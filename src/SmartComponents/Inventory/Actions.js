import React, { Component } from 'react';
import { Dropdown, KebabToggle, DropdownItem, DropdownPosition } from '@patternfly/react-core';

export default class KebabDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    onToggle = isOpen => {
        this.setState({
            isOpen
        });
    };

    onSelect = event => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    render() {
        const { isOpen } = this.state;
        return (
            <Dropdown
                onSelect={ this.onSelect }
                toggle={ <KebabToggle onToggle={ this.onToggle } /> }
                isOpen={ isOpen }
                position={ DropdownPosition.right }
                isPlain
                dropdownItems={ [
                    <DropdownItem key="link">First action</DropdownItem>
                ] }
            />
        );
    }
}
