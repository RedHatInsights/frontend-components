import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingCard from './LoadingCard';
import { collectionInformationSelector } from './selectors';

const CollectionCard = ({ detailLoaded, collectionInformation, entity }) => (<LoadingCard
    title="Collection information"
    isLoading={ !detailLoaded }
    items={ [
        { title: 'Insights client', value: collectionInformation.client },
        { title: 'Egg', value: collectionInformation.egg },
        { title: 'Last check-in', value: entity && new Date(entity.updated).toLocaleString() },
        { title: 'Registered', value: entity && new Date(entity.created).toLocaleString() }
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
