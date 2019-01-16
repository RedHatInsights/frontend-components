import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    Card,
    CardHeader,
    CardBody,
    TextContent,
    Text,
    TextVariants,
    Grid,
    GridItem,
    GutterSize,
    Level,
    LevelItem
} from '@patternfly/react-core';
import { Table } from '../../../PresentationalComponents/Table';
import { Pagination } from '../../../PresentationalComponents/Pagination';
import './general-information.scss';

class GeneralInformation extends Component {
    render() {
        const { entity } = this.props;
        const facts = entity.facts.qpc || entity.facts.inventory || entity.facts;
        const timeZone = new Date(entity.created).toString().split(' GMT').slice(1)[0];
        return (
            <Grid sm={ 6 } md={ 6 } lg={ 6 } gutter={ GutterSize.md }>
                <GridItem>
                    <TextContent>
                        <Card>
                            <CardHeader>
                                <Text component={ TextVariants.h1 }>System</Text>
                            </CardHeader>
                            <CardBody>
                                <Level>
                                    <LevelItem>Manufacturer:</LevelItem>
                                    <LevelItem>{ (facts && facts.virtualized_type) || 'Unknown' }</LevelItem>
                                </Level>
                                <Level>
                                    <LevelItem>Release:</LevelItem>
                                    <LevelItem>{ (facts && facts.os_release) || 'Unknown' }</LevelItem>
                                </Level>
                                <Level>
                                    <LevelItem>Server Type:</LevelItem>
                                    <LevelItem>{ (facts && facts.infrastructure_type) || 'Unknown' }</LevelItem>
                                </Level>
                                <Level>
                                    <LevelItem>Time Zone:</LevelItem>
                                    <LevelItem>{ timeZone && `${timeZone.slice(0, 3)}:${timeZone.slice(3)}` }</LevelItem>
                                </Level>
                            </CardBody>
                        </Card>
                    </TextContent>
                </GridItem>
                <GridItem>
                    <TextContent>
                        <Card>
                            <CardHeader>
                                <Text component={ TextVariants.h1 }>Bios</Text>
                            </CardHeader>
                            <CardBody>
                                <Level>
                                    <LevelItem>UUID:</LevelItem>
                                    <LevelItem>{ entity.bios_uuid || 'Unknown' }</LevelItem>
                                </Level>
                            </CardBody>
                        </Card>
                    </TextContent>
                </GridItem>
                <GridItem span={ 12 }>
                    <TextContent>
                        <Card>
                            <CardHeader>
                                <Text component={ TextVariants.h1 }>Network</Text>
                            </CardHeader>
                            <CardBody>
                                <Table rows={ [{
                                    cells: [{
                                        title: 'No network data at the moment. Come back later to see more information',
                                        colSpan: 3,
                                        className: 'ins-no-data'
                                    }]
                                }] }
                                header={ [
                                    { title: 'Process Name', hasSort: false },
                                    { title: 'IP Address', hasSort: false },
                                    { title: 'Port', hasSort: false }
                                ] }
                                footer={ <Pagination numberOfItems={ 0 } /> }
                                />
                            </CardBody>
                        </Card>
                    </TextContent>
                </GridItem>
            </Grid>
        );
    }
}

GeneralInformation.propTypes = {
    entity: PropTypes.shape({
        created: PropTypes.string,
        // eslint-disable-next-line camelcase
        bios_uuid: PropTypes.string,
        facts: PropTypes.object
    })
};
GeneralInformation.defaultProps = {
    entity: {
        facts: {
            inventory: {}
        }
    }
};

const mapStateToProps = ({ entityDetails: { entity }}) => ({ entity });

export default connect(mapStateToProps)(GeneralInformation);
