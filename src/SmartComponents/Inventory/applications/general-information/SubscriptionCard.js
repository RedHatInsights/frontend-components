import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingCard from './LoadingCard';
import { repositoriesMapper, productsMapper } from './dataMapper';
import { subscriptionsSelector } from './selectors';

function enabledRepos(repositories) {
    if (repositories) {
        return [
            repositories.enabled.length > 0 && `${repositories.enabled.length} enabled`,
            repositories.disabled.length > 0 && `${repositories.disabled.length} disabled`
        ].filter(Boolean).join(' / ');
    }

    return 0;
}

const SubscriptionCard = ({ detailLoaded, subscriptions, handleClick }) => (<LoadingCard
    title="Subscriptions"
    isLoading={ !detailLoaded }
    items={ [
        {
            title: 'Red Hat products',
            value: subscriptions.rhProducts ? `${subscriptions.rhProducts.length} products` : 0,
            target: 'red_hat_products',
            onClick: () => handleClick(
                'Red Hat products',
                productsMapper(subscriptions.rhProducts)
            )
        },
        { title: 'Status', value: subscriptions.status },
        { title: 'Auto-attached', value: subscriptions.autoAttached },
        { title: 'Katello agent', value: '' },
        {
            title: 'Repositories',
            value: enabledRepos(subscriptions.repositories),
            target: 'repositories',
            onClick: () => {
                handleClick(
                    'Repositories',
                    repositoriesMapper(subscriptions.repositories)
                );
            }
        }
    ] }
/>);

SubscriptionCard.propTypes = {
    detailLoaded: PropTypes.bool,
    handleClick: PropTypes.func,
    subscriptions: PropTypes.shape({
        rhProducts: PropTypes.array,
        status: PropTypes.string,
        autoAttached: PropTypes.string,
        repositories: PropTypes.shape({
            enabled: PropTypes.array,
            disabled: PropTypes.array
        })
    })
};
SubscriptionCard.defaultProps = {
    detailLoaded: false,
    handleClick: () => undefined
};

export default connect(({
    entityDetails: {
        systemProfile
    }
}) => ({
    detailLoaded: systemProfile && systemProfile.loaded,
    subscriptions: subscriptionsSelector(systemProfile)
}))(SubscriptionCard);
