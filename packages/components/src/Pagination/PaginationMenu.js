import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CaretDownIcon, CaretUpIcon, CheckIcon } from '@patternfly/react-icons';
import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';

class PaginationNav extends Component {
    state = {
        isOpen: false
    }

    onSelect = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    onToggle = isOpen => {
        this.setState({
            isOpen
        });
    };

    render() {
        const {
            itemsTitle,
            itemsStart,
            itemsEnd,
            widtgetId,
            dropDirection,
            onSetPerPage,
            itemCount,
            perPageOptions,
            className,
            perPage,
            ...props
        } = this.props;
        const { isOpen } = this.state;
        return (
            <div className={ `pf-c-options-menu ${className}` } { ...props }>
                <span id={ `${widtgetId}-label` } hidden>Items per page:</span>
                <div className="pf-c-options-menu__toggle pf-m-text pf-m-plain">
                    <Dropdown direction={ dropDirection }
                        isPlain
                        isOpen={ isOpen }
                        onSelect={ this.onSelect }
                        dropdownItems={ perPageOptions.map(({ title, value }) => (
                            <DropdownItem onClick={ event => value !== perPage && onSetPerPage(event, value) } key={ value } component="button">
                                { title }
                                { value === perPage && <CheckIcon className="pf-c-options-menu__menu-item-icon" size="md" /> }
                            </DropdownItem>
                        )) }
                        toggle={
                            <DropdownToggle onToggle={ this.onToggle } toggleIndicator={ null } className="pf-c-options-menu__toggle-button">
                                <span className="pf-c-options-menu__toggle-text">
                                    <b>{ itemsStart } - { itemsEnd }</b> of <b>{ itemCount }</b> { itemsTitle }
                                </span>
                                { dropDirection === 'up' ? <CaretUpIcon /> : <CaretDownIcon /> }
                            </DropdownToggle>
                        }
                    />
                </div>
            </div>
        );
    }
}

PaginationNav.propTypes = {
    itemsTitle: PropTypes.string,
    itemsStart: PropTypes.number,
    itemsEnd: PropTypes.number,
    dropDirection: PropTypes.string,
    widtgetId: PropTypes.string,
    onSetPerPage: PropTypes.func,
    itemCount: PropTypes.number.isRequired,
    perPage: PropTypes.number,
    perPageOptions: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.node,
        value: PropTypes.number
    })),
    className: PropTypes.string
};

PaginationNav.defaultProps = {
    itemsTitle: 'items',
    dropDirection: 'up',
    className: ''
};

export default PaginationNav;
