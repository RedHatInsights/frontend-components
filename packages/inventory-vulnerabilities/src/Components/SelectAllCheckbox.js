import { Checkbox, Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import propTypes from 'prop-types';
import React, { Component } from 'react';

class SelectAllCheckbox extends Component {
    state = { isOpen: false };

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.isOpen !== this.state.isOpen || nextProps.selectedItems !== this.props.selectedItems) {
            return true;
        }

        return false;
    }

    onToggle = isOpen => {
        this.setState({
            isOpen
        });
    };

    onSelect = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    selectPage = () => {
        const {
            cves: { data },
            selectorHandler
        } = this.props;
        const cveNames = data.map(cve => cve.id);
        selectorHandler(true, cveNames);
    };

    selectAll = () => {
        const {
            cves: { meta },
            selectorHandler,
            fetchResource
        } = this.props;
        // eslint-disable-next-line camelcase
        let { payload } = fetchResource && fetchResource({ page_size: meta.total_items, page: 1 });
        payload &&
            payload.then(({ data: response }) => {
                const cveNames = response.map(cve => cve.id);
                selectorHandler(true, cveNames);
            });
    };

    unselectAll = () => {
        const { selectorHandler } = this.props;
        selectorHandler(false, undefined);
    };

    onCheckboxChange = () => {
        const { selectedItems } = this.props;
        if (selectedItems === 0) {
            this.selectAll();
        } else {
            this.unselectAll();
        }
    };

    render() {
        const { selectedItems, cves } = this.props;
        const { meta } = cves;
        const { isOpen } = this.state;
        const checkboxlabel = Boolean(selectedItems) && `${selectedItems} selected`;

        const dropdownItems = [
            <DropdownItem key="none" onClick={ this.unselectAll }>
                Select none (0 items)
            </DropdownItem>,
            <DropdownItem key="page" onClick={ this.selectPage }>
                Select page ({ meta.page_size } items)
            </DropdownItem>,
            <DropdownItem key="all" onClick={ this.selectAll }>
                Select all ({ meta.total_items } items)
            </DropdownItem>
        ];
        return (
            <Dropdown
                onSelect={ this.onSelect }
                toggle={
                    <DropdownToggle
                        splitButtonItems={ [
                            <Checkbox
                                key={ 'selectAllcheckbox' }
                                isChecked={ meta.total_items === selectedItems ? true : selectedItems === 0 ? false : null }
                                onChange={ this.onCheckboxChange }
                            />,
                            checkboxlabel
                        ] }
                        onToggle={ this.onToggle }
                    />
                }
                isOpen={ isOpen }
                dropdownItems={ dropdownItems }
            />
        );
    }
}

SelectAllCheckbox.propTypes = {
    selectedItems: propTypes.number,
    selectorHandler: propTypes.func,
    fetchResource: propTypes.func,
    cves: propTypes.object
};

export default SelectAllCheckbox;
