import React, { Component, Fragment } from 'react';
import { DataToolbarItem } from '@patternfly/react-core/dist/esm/experimental';
import { Dropdown, DropDownItem, KebabToggle, Button } from '@patternfly/react-core';

import PropTypes from 'prop-types';

class Actions extends Component {
    state = {
        isOpen: false
    }

    toggleOpen = (isOpen) => {
        this.setState({ isOpen });
    }

    render() {
        const { actions } = this.props;
        const [ firstAction, ...restActions ] = actions;
        return (
            <Fragment>
                {
                    firstAction &&
                    <DataToolbarItem>
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
                            onSelect={ () => this.toggleOpen(false) }
                            toggle={ <KebabToggle onToggle={ (isOpen) => this.toggleOpen(isOpen) } /> }
                            dropdownItems={ [
                                <DropDownItem
                                    { ...firstAction.props }
                                    key="first-action"
                                    className={
                                        `ins-c-primary-toolbar__first-action ${firstAction.props.className || ''}`
                                    }
                                >
                                    { firstAction.label || firstAction }
                                </DropDownItem>,
                                ...restActions.map((action, key) => (
                                    <DropDownItem
                                        { ...action.props }
                                        key={ action.value || key }
                                        component={ (action.props && action.props.component) || 'button' }
                                        onClick={ (e) => action.onClick(e, action, key) }
                                    >{ action.label || action }</DropDownItem>
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
    ]))
};

Actions.defaultProps = {
    actions: []
};

export default Actions;
