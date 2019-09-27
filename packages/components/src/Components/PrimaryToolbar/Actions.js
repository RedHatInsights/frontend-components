import React, { Component, Fragment } from 'react';
import { DataToolbarItem } from '@patternfly/react-core/dist/esm/experimental';
import { Dropdown, DropdownItem, KebabToggle, Button, DropdownSeparator } from '@patternfly/react-core';
import PropTypes from 'prop-types';

const overflowActionsMapper = (action, key) => (
    <DropdownItem
        { ...action.props }
        className="ins-c-primary-toolbar__overflow-actions"
        key={ action.value || `${key}-overflow` }
        component={ (action.props && action.props.component) || 'button' }
        onClick={ (e) => action.onClick(e, action, key) }
    >
        { action.label || action }
    </DropdownItem>
);

const actionPropsGenerator = (action, key) => ({
    ...action.props,
    component: (action.props && action.props.component) ||
        React.isValidElement(action.label || action) ? 'div' : 'button',
    onClick: (e) => action.onClick && action.onClick(e, action, key),
    children: action.label || action
});

class Actions extends Component {
    state = {
        isOpen: false
    }

    toggleOpen = (isOpen) => {
        this.setState({ isOpen });
    }

    render() {
        const { isOpen } = this.state;
        const { actions, overflowActions, onSelect, dropdownProps } = this.props;
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
                    ((actions && actions.length > 1) || (overflowActions.length > 0)) &&
                    <DataToolbarItem
                        className={ `${actions.length <= 1 && 'ins-m-actions--empty'}` }
                    >
                        <Dropdown
                            { ...dropdownProps }
                            isOpen={ isOpen }
                            isPlain
                            onSelect={ (...props) => {
                                onSelect && onSelect(...props);
                                this.toggleOpen(false);
                            } }
                            toggle={ <KebabToggle onToggle={ (isOpen) => this.toggleOpen(isOpen) } /> }
                            dropdownItems={ [
                                ...firstAction ? [
                                    <DropdownItem
                                        key="first-action"
                                        { ...actionPropsGenerator(firstAction, 'first-action') }
                                        className={
                                            `ins-c-primary-toolbar__first-action ${firstAction.props.className || ''}`
                                        }
                                    />
                                    
                                ] : [],
                                ...restActions.map((action, key) => (
                                    <DropdownItem
                                        key={ action.key || (action && action.props && action.props.key) || key }
                                        { ...actionPropsGenerator(action, key) }
                                    />
                                )),
                                ...actions.length > 0 ? [ <DropdownSeparator
                                    key="separator"
                                    className="ins-c-primary-toolbar__overflow-actions-separator"
                                /> ] : [],
                                ...overflowActions.map(overflowActionsMapper)
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
    onSelect: PropTypes.func,
    overflowActions: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.node,
        value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
        onClick: PropTypes.func,
        props: PropTypes.any
    })),
    dropdownProps: PropTypes.shape({
        [PropTypes.string]: PropTypes.any
    })
};

Actions.defaultProps = {
    actions: [],
    overflowActions: [],
    dropdownProps: {},
    onSelect: () => undefined
};

export default Actions;
