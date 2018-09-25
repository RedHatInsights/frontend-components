import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Title, Grid, GridItem, Badge } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import { SyncAltIcon } from '@patternfly/react-icons';
import { Dropdown, DropdownItem, DropdownPosition } from '../../PresentationalComponents/Dropdown';
import get from 'lodash/get';
import { connect } from 'react-redux';
import ApplicationDetails from './ApplicationDetails';

class EntityDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            actionCollapsed: true
        };
        this.getFact = this.getFact.bind(this);
        this.toggleActions = this.toggleActions.bind(this);
    }

    getFact(path) {
        const { entity } = this.props;
        return get(entity, path, 'unknown');
    }

    toggleActions(_event, collapsed) {
        this.setState({
            actionCollapsed: collapsed
        });
    }
    render() {
        const { loaded, entity, tags } = this.props;
        const { actionCollapsed } = this.state;
        if (!loaded) {
            return (
                <div>
                    <SyncAltIcon/>
                </div>
            );
        }

        return (
            <div className="ins-entity-detail">
                <Grid className="ins-entity-header">
                    <GridItem md={ 6 }>
                        <Title size='2xl'>{ entity.display_name }</Title>
                    </GridItem>
                    <GridItem md={ 6 }>
                        <Dropdown title="Actions"
                            isCollapsed={ actionCollapsed }
                            onToggle={ this.toggleActions }
                            position={ DropdownPosition.right }>
                            <DropdownItem>Some action</DropdownItem>
                        </Dropdown>
                    </GridItem>
                </Grid>
                <Grid className="ins-entity-facts">
                    <GridItem md={ 6 }>
                        <div>
                            <span>
                                Hostname:
                            </span>
                            <span>
                                { this.getFact('display_name') }
                            </span>
                        </div>
                        <div>
                            <span>
                                UUID:
                            </span>
                            <span>
                                { this.getFact(`canonical_facts['machine-id']`) }
                            </span>
                        </div>
                        <div>
                            <span>
                                System:
                            </span>
                            <span>
                                { this.getFact('facts.release') }
                            </span>
                        </div>
                    </GridItem>
                    <GridItem md={ 6 }>
                        <div>
                            <span>
                                Last Check-in:
                            </span>
                            <span>
                                { this.getFact('facts.check_in') }
                            </span>
                        </div>
                        <div>
                            <span>
                                Registered:
                            </span>
                            <span>
                                { this.getFact('facts.registered') }
                            </span>
                        </div>
                    </GridItem>
                </Grid>
                <Grid className="ins-entity-tags">
                    { tags && Object.values(tags).map((oneTag, key) => (
                        <GridItem span={ 1 } key={ key }>
                            <Badge>
                                <TimesIcon />{ oneTag[0] }
                            </Badge>
                        </GridItem>
                    )) }
                </Grid>
                <ApplicationDetails />
            </div>
        );
    }
}

EntityDetails.propTypes = {
    loaded: PropTypes.bool.isRequired,
    entity: PropTypes.object,
    tags: PropTypes.any
};

export default connect(({ entityDetails }) => ({ ...entityDetails }))(EntityDetails);
