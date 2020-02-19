import React, { Component, Fragment } from 'react';
import { DataToolbarItem } from '@patternfly/react-core/dist/js/experimental';
import { Dropdown, DropdownItem, KebabToggle, Button, DropdownSeparator } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { DownloadButton } from '../DownloadButton';

export const overflowActionsMapper = (action, key) => (
    <DropdownItem
        { ...action.props }
        className="ins-c-primary-toolbar__overflow-actions"
        key={ action.value || action.key || `${key}-overflow` }
        component={ (action.props && action.props.component) ||
            React.isValidElement(action.label || action) ? 'div' : 'button' }
        onClick={(e) => action.onClick && action.onClick(e, action, key) }
    >
        { action.label || action }
    </DropdownItem>
);

export const actionPropsGenerator = (action, key) => ({
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
        const { actions, overflowActions, onSelect, dropdownProps, kebabToggleProps, exportConfig } = this.props;
        const [ firstAction, ...restActions ] = actions;
        return (
            <Fragment>
                {
                    firstAction &&
                    <DataToolbarItem className="ins-c-primary-toolbar__first-action pf-m-spacer-sm">
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
                    exportConfig && (exportConfig.extraItems || exportConfig.onSelect) &&
                    <DataToolbarItem className="pf-m-spacer-sm">
                        <DownloadButton  { ...exportConfig } />
                    </DataToolbarItem>
                }
                {
                    ((actions && actions.length > 0) || (overflowActions.length > 0)) &&
                    <DataToolbarItem
                        className={`${actions.length <= 1 ? 'ins-m-actions--empty' : ''} ins-c-primary-toolbar__actions pf-m-spacer-sm` }
                    >
                        <Dropdown
                            { ...dropdownProps }
                            isOpen={ isOpen }
                            isPlain
                            onSelect={ (...props) => {
                                onSelect && onSelect(...props);
                                this.toggleOpen(false);
                            } }
                            toggle={ <KebabToggle { ...kebabToggleProps } onToggle={ (isOpen) => this.toggleOpen(isOpen) } /> }
                            dropdownItems={ [
                                ...firstAction ? [
                                    <DropdownItem
                                        key="first-action"
                                        { ...actionPropsGenerator(firstAction, 'first-action') }
                                        className={
                                            `ins-c-primary-toolbar__first-action ${(firstAction.props && firstAction.props.className) || ''}`
                                        }
                                    />
                                ] : [],
                                ...restActions.map((action, key) => (
                                    <DropdownItem
                                        key={ action.key || (action && action.props && action.props.key) || key }
                                        { ...actionPropsGenerator(action, key) }
                                    />
                                )),
                                ...(actions.length > 0 && overflowActions.length > 0) ? [ <DropdownSeparator
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

const actionsType = PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.shape({
        label: PropTypes.node,
        value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
        onClick: PropTypes.func,
        props: PropTypes.any
    }),
    PropTypes.string
]));

Actions.propTypes = {
    actions: actionsType,
    onSelect: PropTypes.func,
    overflowActions: actionsType,
    dropdownProps: PropTypes.shape({
        [PropTypes.string]: PropTypes.any
    }),
    kebabToggleProps: PropTypes.shape({
        [PropTypes.string]: PropTypes.any
    }),
    exportConfig: PropTypes.shape(DownloadButton.propTypes)
};

Actions.defaultProps = {
    actions: [],
    overflowActions: [],
    dropdownProps: {},
    exportConfig: {},
    onSelect: () => undefined
};

export default Actions;
