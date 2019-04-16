import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingCard from './LoadingCard';
import { generalMapper } from './dataMapper';
import { configurationSelector } from './selectors';

const ConfigurationCard = ({ detailLoaded, configuration, handleClick }) => (<LoadingCard
    title="Configuration"
    isLoading={ !detailLoaded }
    items={ [
        {
            title: 'Installed packages',
            value: configuration.packages ? `${configuration.packages.length} packages` : 0,
            target: 'installed_packages',
            onClick: () => {
                handleClick(
                    'Installed packages',
                    generalMapper(configuration.packages, 'Package name')
                );
            }
        },
        {
            title: 'Services',
            value: configuration.services ? `${configuration.services.length} services` : 0,
            target: 'services',
            onClick: () => {
                handleClick(
                    'Services',
                    generalMapper(configuration.services, 'Service name')
                );
            }
        },
        {
            title: 'Running processes',
            value: configuration.processes ? `${configuration.processes.length} processes` : 0,
            target: 'running_processes',
            onClick: () => {
                handleClick(
                    'Running processes',
                    generalMapper(configuration.processes, 'Process name')
                );
            }
        }
    ] }
/>);

ConfigurationCard.propTypes = {
    detailLoaded: PropTypes.bool,
    handleClick: PropTypes.func,
    configuration: PropTypes.shape({
        packages: PropTypes.arrayOf(PropTypes.string),
        services: PropTypes.arrayOf(PropTypes.string),
        processes: PropTypes.arrayOf(PropTypes.string)
    })
};
ConfigurationCard.defaultProps = {
    detailLoaded: false,
    handleClick: () => undefined
};

export default connect(({
    entityDetails: {
        systemProfile
    }
}) => ({
    detailLoaded: systemProfile && systemProfile.loaded,
    configuration: configurationSelector(systemProfile)
}))(ConfigurationCard);
