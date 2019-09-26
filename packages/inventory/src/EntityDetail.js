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
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import get from 'lodash/get';
import { connect } from 'react-redux';
import ApplicationDetails from './ApplicationDetails';
import { editDisplayName, editAnsibleHost, loadEntity } from './redux/actions';

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
                                actions && actions.length > 0 && <Dropdown
                                    onSelect={ this.onSelect }
                                    toggle={ <DropdownToggle onToggle={ this.toggleActions }>Actions</DropdownToggle> }
                                    isOpen={ isOpen }
                                    position={ DropdownPosition.right }
                                    dropdownItems={ [ ...(actions ?
                                        actions.map((action, key) => (
                                            <DropdownItem
                                                key={ action.key || key }
                                                component="button"
                                                onClick={ (event) => action.onClick(event, action, action.key || key) }
                                            >
                                                { action.title }
                                            </DropdownItem>)
                                        ) : []) ] }
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
        const { useCard } = this.props;

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
