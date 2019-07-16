import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import propTypes from 'prop-types';
import React, { Component } from 'react';

class IndeterminateCheckbox extends React.Component {
    componentDidMount() {
        const { indeterminate } = this.props;
        if (indeterminate) {
            this._setIndeterminate(true);
        }
    }

    componentDidUpdate(previousProps) {
        if (previousProps.indeterminate !== this.props.indeterminate) {
            this._setIndeterminate(this.props.indeterminate);
        }
    }

    _setIndeterminate(indeterminate) {
        const node = this.node;
        node.indeterminate = indeterminate;
    }

    render() {
        const { indeterminate, type, ...props } = this.props;
        return <input type="checkbox" { ...props } ref={ node => (this.node = node) } />;
    }
}

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

    onSelect = event => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    selectPage = () => {
        const {
            cves: { meta, data },
            selectorHandler
        } = this.props;
        const cveNames = data.map(cve => cve.id);
        selectorHandler(true, cveNames);
    };

    selectAll = () => {
        const {
            cves: { meta, data },
            selectorHandler,
            fetchResource
        } = this.props;
        // eslint-disable-next-line camelcase
        let { payload } = fetchResource && fetchResource({ page_size: meta.total_items });
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
        const { selectedItems, cves, fetchResource } = this.props;
        const { meta } = cves;
        const { isOpen } = this.state;
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
                            <IndeterminateCheckbox
                                key={ 'selectAllcheckbox' }
                                checked={ selectedItems === meta.total_items }
                                indeterminate={ selectedItems !== 0 && selectedItems !== meta.total_items }
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
