import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
    Title,
    Grid,
    GridItem,
    Card,
    CardBody,
    CardHeader
} from '@patternfly/react-core';
import { Skeleton, SkeletonSize } from '../../PresentationalComponents/Skeleton';
import get from 'lodash/get';
import { connect } from 'react-redux';
import ApplicationDetails from './ApplicationDetails';

class EntityDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    getFact = (path) => {
        const { entity } = this.props;
        return get(entity, path, undefined);
    }

    toggleActions = (collapsed) => {
        this.setState({
            isOpen: collapsed
        });
    }

    generateTop = () => {
        const { entity, loaded } = this.props;
        // const { isOpen } = this.state;
        return (
            <Grid className="ins-entity-header">
                <GridItem md={ 6 }>
                    {
                        loaded ?
                            <Title size='2xl'>{ entity && entity.display_name }</Title> :
                            <Skeleton size={ SkeletonSize.md } />
                    }
                </GridItem>
                { /* <GridItem md={ 6 }>
                    <Dropdown
                        onSelect={ this.onSelect }
                        toggle={ <DropdownToggle onToggle={ this.toggleActions }>Actions</DropdownToggle> }
                        isOpen={ isOpen }
                        position={ DropdownPosition.right }
                        dropdownItems={ [
                            <DropdownItem key="1">Some action</DropdownItem>
                        ] }
                    />
                </GridItem> */ }
            </Grid>
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
                { /* Since we do not have tags yet, let's ignore them for now
                    <Grid className="ins-entity-tags">
                        { entity && entity.tags && Object.values(entity.tags).map((oneTag, key) => (
                            <GridItem span={ 1 } key={ key } data-key={ key } widget="tag">
                                <Label isCompact>
                                    <TimesIcon />{ oneTag }
                                </Label>
                            </GridItem>
                        )) }
                    </Grid>
                 */ }
                <ApplicationDetails />
            </div>
        );
    }
}

EntityDetails.propTypes = {
    loaded: PropTypes.bool.isRequired,
    entity: PropTypes.object,
    useCard: PropTypes.bool
};

EntityDetails.defualtProps = {
    entity: {},
    useCard: false
};

export default connect(({ entityDetails }) => ({ ...entityDetails }))(EntityDetails);
