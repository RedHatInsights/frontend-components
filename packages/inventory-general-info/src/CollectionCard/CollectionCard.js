import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Tooltip } from '@patternfly/react-core';

import LoadingCard from '../LoadingCard';
import { collectionInformationSelector } from '../selectors';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import { extraShape } from '../constants';

const VersionTooltip = ({ egg, client }) => (
    <Tooltip
        content={
            <React.Fragment>
                <p>RPM version: { client || 'Not available' }</p>
                <p>Dynamic update version: { egg || 'Not available' }</p>
            </React.Fragment>
        }
    >
        <span>{ client || egg || 'Not available' }</span>
    </Tooltip>
);

VersionTooltip.propTypes = {
    egg: PropTypes.string,
    client: PropTypes.string
};

const CollectionCard = ({
    detailLoaded,
    collectionInformation,
    entity,
    handleClick,
    hasClient,
    hasLastCheckIn,
    hasRegistered,
    hasInsightsId,
    hasReporter,
    hasMachineId,
    extra
}) => (<LoadingCard
    title="Collection information"
    isLoading={ !detailLoaded }
    items={ [
        ...hasClient ? [{ title: 'Insights client', value: <VersionTooltip egg={collectionInformation.egg} client={collectionInformation.client}/> }] : [],
        ...hasLastCheckIn ? [{ title: 'Last check-in', value: entity && (
            DateFormat ?
                <DateFormat date={ entity.updated } type="onlyDate" /> :
                new Date(entity.updated).toLocaleString()
        ) }] : [],
        ...hasRegistered ? [{ title: 'Registered', value: entity && (
            DateFormat ?
                <DateFormat date={entity.created} type="onlyDate" /> :
                new Date(entity.created).toLocaleString()
        ) }] : [],
        ...hasInsightsId ? [{ title: 'Insights id', value: entity && entity.insights_id }] : [],
        ...hasReporter ? [{ title: 'Reporter', value: entity && entity.reporter }] : [],
        ...hasMachineId ? [{ title: 'RHEL machine id', value: entity && entity.rhel_machine_id }] : [],
        ...extra.map(({ onClick, ...item }) => ({
            ...item,
            ...onClick && { onClick: (e) => onClick(e, handleClick) }
        }))
    ] }
/>);

CollectionCard.propTypes = {
    detailLoaded: PropTypes.bool,
    entity: PropTypes.shape({
        updated: PropTypes.string,
        created: PropTypes.string
    }),
    handleClick: PropTypes.func,
    collectionInformation: PropTypes.shape({
        client: PropTypes.string,
        egg: PropTypes.string
    }),
    hasClient: PropTypes.bool,
    hasLastCheckIn: PropTypes.bool,
    hasRegistered: PropTypes.bool,
    hasInsightsId: PropTypes.bool,
    hasReporter: PropTypes.bool,
    hasMachineId: PropTypes.bool,
    extra: PropTypes.arrayOf(extraShape)
};
CollectionCard.defaultProps = {
    detailLoaded: false,
    handleClick: () => undefined,
    hasClient: true,
    hasEgg: true,
    hasLastCheckIn: true,
    hasRegistered: true,
    hasInsightsId: true,
    hasReporter: true,
    hasMachineId: true,
    extra: []
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
