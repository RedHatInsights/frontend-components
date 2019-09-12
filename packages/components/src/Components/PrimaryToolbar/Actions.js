import React, { Component, Fragment } from 'react';
import { DataToolbarItem } from '@patternfly/react-core/dist/esm/experimental';
import { Dropdown, DropdownItem, KebabToggle, Button, DropdownSeparator } from '@patternfly/react-core';
import PropTypes from 'prop-types';

class Actions extends Component {
    state = {
        isOpen: false
    }

    toggleOpen = (isOpen) => {
        this.setState({ isOpen });
    }

    render() {
        const { isOpen } = this.state;
        const { actions, overflowActions } = this.props;
        const [ firstAction, ...restActions ] = actions;
        return (
            <Fragment>
                {
                    firstAction &&
                    <DataToolbarItem className="ins-c-primary-toolbar__first-action">
                        {
                            firstAction.label ?
                                <Button { ...firstAction.props }>
                                    { firstAction.label }
                                </Button> :
                                firstAction
                        }
                    </DataToolbarItem>
                }
                {
                    (actions && actions.length > 0) &&
                    <DataToolbarItem>
                        <Dropdown
                            isOpen={ isOpen }
                            isPlain
                            onSelect={ () => this.toggleOpen(false) }
                            toggle={ <KebabToggle onToggle={ (isOpen) => this.toggleOpen(isOpen) } /> }
                            dropdownItems={ [
                                <DropdownItem
                                    { ...firstAction.props }
                                    key="first-action"
                                    className={
                                        `ins-c-primary-toolbar__first-action ${firstAction.props.className || ''}`
                                    }
                                >
                                    { firstAction.label || firstAction }
                                </DropdownItem>,
                                ...restActions.map((action, key) => (
                                    <DropdownItem
                                        { ...action.props }
                                        key={ action.value || key }
                                        component={ (action.props && action.props.component) || 'button' }
                                        onClick={ (e) => action.onClick(e, action, key) }
                                    >{ action.label || action }</DropdownItem>
                                )),
                                <DropdownSeparator
                                    key="separator"
                                    className="ins-c-primary-toolbar__overflow-actions-separator"
                                />,
                                ...overflowActions.map((action, key) => (
                                    <DropdownItem
                                        { ...action.props }
                                        className="ins-c-primary-toolbar__overflow-actions"
                                        key={ action.value || `${key}-overflow` }
                                        component={ (action.props && action.props.component) || 'button' }
                                        onClick={ (e) => action.onClick(e, action, key) }
                                    >{ action.label || action }</DropdownItem>
                                ))
                            ] }
                        />
                    </DataToolbarItem>
                }
            </Fragment>
        );
    }
}

Actions.propTypes = {
    actions: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.shape({
            label: PropTypes.node,
            value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
            onClick: PropTypes.func,
            props: PropTypes.any
        })
    ])),
    overflowActions: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.node,
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        onClick: PropTypes.func,
        props: PropTypes.any
    }))
};

Actions.defaultProps = {
    actions: [],
    overflowActions: []
};

export default Actions;
