import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
    Title,
    Grid,
    GridItem,
    Dropdown,
    DropdownPosition,
    DropdownItem,
    DropdownToggle,
    Card,
    CardBody,
    CardHeader
} from '@patternfly/react-core';
import { BulletList } from 'react-content-loader';
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
        const { entity } = this.props;
        // const { isOpen } = this.state;
        return (
            <Grid className="ins-entity-header">
                <GridItem md={ 6 }>
                    <Title size='2xl'>{ entity && entity.display_name }</Title>
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
        return (
            <Grid className="ins-entity-facts">
                <GridItem md={ 6 }>
                    <div>
                        <span>
                            Hostname:
                        </span>
                        <span>
                            { this.getFact('fqdn') || this.getFact('facts.hostname') || 'Unknown' }
                        </span>
                    </div>
                    <div>
                        <span>
                            UUID:
                        </span>
                        <span>
                            {
                                this.getFact(`id`) ||
                                'Unknown'
                            }
                        </span>
                    </div>
                    <div>
                        <span>
                            System:
                        </span>
                        <span>
                            {
                                this.getFact('facts.os_release') ||
                                this.getFact('facts.inventory.release') ||
                                this.getFact('facts.qpc.os_release') ||
                                'Unknown'
                            }
                        </span>
                    </div>
                </GridItem>
                <GridItem md={ 6 }>
                    <div>
                        <span>
                            Last Check-in:
                        </span>
                        <span>
                            { (new Date(this.getFact('updated'))).toLocaleString() }
                        </span>
                    </div>
                    <div>
                        <span>
                            Registered:
                        </span>
                        <span>
                            { (new Date(this.getFact('created'))).toLocaleString() }
                        </span>
                    </div>
                </GridItem>
            </Grid>
        );
    }

    render() {
        const { loaded, useCard } = this.props;
        if (!loaded) {
            return (
                <div>
                    <BulletList/>
                </div>
            );
        }

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
