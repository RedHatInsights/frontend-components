import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
    Title,
    Grid,
    GridItem,
    Card,
    CardBody,
    CardHeader,
    SplitItem,
    Split,
    Dropdown,
    DropdownItem,
    DropdownPosition,
    DropdownToggle
} from '@patternfly/react-core';
import { Skeleton, SkeletonSize } from '../../PresentationalComponents/Skeleton';
import get from 'lodash/get';
import { connect } from 'react-redux';
import ApplicationDetails from './ApplicationDetails';
import { editDisplayName, editAnsibleHost, loadEntity } from '../../redux/actions/inventory';
import TextInputModal from './TextInputModal';

class EntityDetails extends Component {
    state = {
        isOpen: false,
        isDisplayNameModalOpen: false,
        isAnsibleHostModalOpen: false
    };

    getFact = (path) => {
        const { entity } = this.props;
        return get(entity, path, undefined);
    }

    getAnsibleHost = () => this.getFact('ansible_host') || this.getFact('fqdn') || this.getFact('id');

    toggleActions = (collapsed) => {
        this.setState({
            isOpen: collapsed
        });
    }

    onSelect = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    openModal = modal => () => this.setState({ [`is${modal}ModalOpen`]: true });

    onSubmit = (fn) => (value) => {
        const { entity } = this.props;
        fn(entity.id, value);
        this.onCancel();
    }

    onCancel = () => {
        this.setState({ isDisplayNameModalOpen: false, isAnsibleHostModalOpen: false });
    }

    generateTop = () => {
        const { entity, loaded, actions } = this.props;
        const { isOpen } = this.state;
        return (
            <Split className="ins-c-inventory__detail--header">
                <SplitItem isFilled>
                    {
                        loaded ?
                            <Title size='2xl'>{ entity && entity.display_name }</Title> :
                            <Skeleton size={ SkeletonSize.md } />
                    }
                </SplitItem>
                {
                    <SplitItem>
                        {
                            loaded ?
                                <Dropdown
                                    onSelect={ this.onSelect }
                                    toggle={ <DropdownToggle onToggle={ this.toggleActions }>Actions</DropdownToggle> }
                                    isOpen={ isOpen }
                                    position={ DropdownPosition.right }
                                    dropdownItems={ [
                                        <DropdownItem
                                            key="1"
                                            component="button"
                                            onClick={ this.openModal('DisplayName') }>
                                            Edit name
                                        </DropdownItem>,
                                        <DropdownItem
                                            key="2"
                                            component="button"
                                            onClick={ this.openModal('AnsibleHost') }>
                                            Edit Ansible host
                                        </DropdownItem>,
                                        ...(actions ?
                                            actions.map((action, key) => (
                                                <DropdownItem
                                                    key={ action.key || key }
                                                    component="button"
                                                    onClick={ (event) => action.onClick(event, action, action.key || key) }
                                                >
                                                    { action.title }
                                                </DropdownItem>)
                                            ) : []
                                        )
                                    ] }
                                /> :
                                <Skeleton size={ SkeletonSize.xl } />
                        }
                    </SplitItem>
                }
            </Split>
        );
    }

    generateFacts = () => {
        const { loaded } = this.props;
        return (
            <Grid className="ins-entity-facts">
                <GridItem md={ 6 }>
                    <div>
                        <span>
                            Hostname:
                        </span>
                        <span>
                            {
                                loaded ?
                                    this.getFact('fqdn') || ' ' :
                                    <Skeleton size={ SkeletonSize.md } />
                            }
                        </span>
                    </div>
                    <div>
                        <span>
                            Ansible host:
                        </span>
                        <span>
                            {
                                loaded ?
                                    this.getAnsibleHost() :
                                    <Skeleton size={ SkeletonSize.md } />
                            }
                        </span>
                    </div>
                    <div>
                        <span>
                            UUID:
                        </span>
                        <span>
                            {
                                loaded ?
                                    this.getFact(`id`) || ' ' :
                                    <Skeleton size={ SkeletonSize.md } />
                            }
                        </span>
                    </div>
                    <div>
                        <span>
                            Last seen:
                        </span>
                        <span>
                            {
                                loaded ?
                                    (new Date(this.getFact('updated'))).toLocaleString() :
                                    <Skeleton size={ SkeletonSize.sm } />
                            }
                        </span>
                    </div>
                </GridItem>
            </Grid>
        );
    }

    render() {
        const { useCard, entity } = this.props;
        const { isDisplayNameModalOpen, isAnsibleHostModalOpen } = this.state;

        return (
            <div className="ins-entity-detail">
                { useCard ?
                    <Card>
                        <CardHeader>
                            { this.generateTop() }
                        </CardHeader>
                        <CardBody>
                            { this.generateFacts() }
                        </CardBody>
                    </Card> :
                    <Fragment>
                        { this.generateTop() }
                        { this.generateFacts() }
                    </Fragment>
                }
                <ApplicationDetails />

                <TextInputModal
                    isOpen={ isDisplayNameModalOpen }
                    title='Edit name'
                    value= { entity && entity.display_name }
                    ariaLabel='Host inventory display name'
                    onCancel={ this.onCancel }
                    onSubmit={ this.onSubmit(this.props.setDisplayName) }
                />
                <TextInputModal
                    isOpen={ isAnsibleHostModalOpen }
                    title='Edit Ansible host'
                    value= { entity && this.getAnsibleHost() }
                    ariaLabel='Ansible host'
                    onCancel={ this.onCancel }
                    onSubmit={ this.onSubmit(this.props.setAnsibleHost) }
                />
            </div>
        );
    }
}

EntityDetails.propTypes = {
    loaded: PropTypes.bool.isRequired,
    entity: PropTypes.object,
    useCard: PropTypes.bool,
    setDisplayName: PropTypes.func,
    setAnsibleHost: PropTypes.func,
    actions: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.node,
        onClick: PropTypes.func,
        key: PropTypes.string
    }))
};

EntityDetails.defualtProps = {
    entity: {},
    useCard: false,
    actions: [],
    setDisplayName: () => undefined,
    setAnsibleHost: () => undefined
};

function mapDispatchToProps(dispatch) {
    const reloadWrapper = (id, event) => {
        event.payload.then(data => {
            dispatch(loadEntity(id, { hasItems: true }));
            return data;
        });

        return event;
    };

    return {
        setDisplayName: (id, value) => {
            dispatch(reloadWrapper(id, editDisplayName(id, value)));
        },

        setAnsibleHost: (id, value) => {
            dispatch(reloadWrapper(id, editAnsibleHost(id, value)));
        }
    };
}

export default connect(({ entityDetails }) => ({ ...entityDetails }), mapDispatchToProps)(EntityDetails);
