import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Tooltip } from '@patternfly/react-core';

import LoadingCard from '../LoadingCard';
import { collectionInformationSelector } from '../selectors';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';

const VersionTooltip = ({ egg, client }) => (
    <Tooltip
        content={
            <React.Fragment>
                <p>RPM version: { egg || 'Not available' }</p>
                <p>Dynamic update version: { client || 'Not available' }</p>
            </React.Fragment>
        }
    >
        <span>{ egg || client || 'Not available' }</span>
    </Tooltip>
);

VersionTooltip.propTypes = {
    egg: PropTypes.string,
    client: PropTypes.string
};

const CollectionCard = ({ detailLoaded, collectionInformation, entity }) => (<LoadingCard
    title="Collection information"
    isLoading={ !detailLoaded }
    items={ [
        { title: 'Insights client', value: <VersionTooltip egg={collectionInformation.egg} client={collectionInformation.client}/> },
        { title: 'Last check-in', value: entity && (
            DateFormat ?
                <DateFormat date={ entity.updated } type="onlyDate" /> :
                new Date(entity.updated).toLocaleString()
        ) },
        { title: 'Registered', value: entity && (
            DateFormat ?
                <DateFormat date={entity.created} type="onlyDate" /> :
                new Date(entity.created).toLocaleString()
        ) },
        { title: 'Insights id', value: entity && entity.insights_id },
        { title: 'Reporter', value: entity && entity.reporter },
        { title: 'RHEL machine id', value: entity && entity.rhel_machine_id }
    ] }
/>);

CollectionCard.propTypes = {
    detailLoaded: PropTypes.bool,
    entity: PropTypes.shape({
        updated: PropTypes.string,
        created: PropTypes.string
    }),
    collectionInformation: PropTypes.shape({
        client: PropTypes.string,
        egg: PropTypes.string
    })
};
CollectionCard.defaultProps = {
    detailLoaded: false
};

export default connect(({
    entityDetails: {
        entity
    },
    systemProfileStore: {
        systemProfile
    }
}) => ({
    entity,
    detailLoaded: systemProfile && systemProfile.loaded,
    collectionInformation: collectionInformationSelector(systemProfile)
}))(CollectionCard);
