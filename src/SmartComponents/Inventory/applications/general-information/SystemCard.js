import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingCard from './LoadingCard';
import { diskMapper } from './dataMapper';
import { propertiesSelector } from './selectors';

const SystemCard = ({ detailLoaded, entity, properties, handleClick }) => (<LoadingCard
    title="System properties"
    isLoading={ !detailLoaded }
    items={ [
        { title: 'Name', value: entity.display_name, size: 'md' },
        { title: 'Number of CPUs', value: properties.cpuNumber },
        { title: 'Sockets', value: properties.sockets },
        { title: 'Cores per socket', value: properties.coresPerSocket },
        { title: 'RAM', value: properties.ramSize },
        {
            title: 'Storage',
            value: properties.storage ? `${properties.storage.length} disks` : 0,
            target: 'storage',
            onClick: () => {
                handleClick('Storage', diskMapper(properties.storage));
            }
        }
    ] }
/>);

SystemCard.propTypes = {
    detailLoaded: PropTypes.bool,
    entity: PropTypes.shape({
        // eslint-disable-next-line camelcase
        display_name: PropTypes.string
    }),
    properties: PropTypes.shape({
        cpuNumber: PropTypes.number,
        sockets: PropTypes.number,
        coresPerSocket: PropTypes.number,
        ramSize: PropTypes.string,
        storage: PropTypes.arrayOf(PropTypes.shape({
            device: PropTypes.string,
            // eslint-disable-next-line camelcase
            mount_point: PropTypes.string,
            options: PropTypes.shape({}),
            type: PropTypes.string
        }))
    }),
    handleClick: PropTypes.func
};
SystemCard.defaultProps = {
    detailLoaded: false,
    entity: {},
    properties: {},
    handleClick: () => undefined
};

export default connect(({
    entityDetails: {
        entity,
        systemProfile
    }
}) => ({
    entity,
    detailLoaded: systemProfile && systemProfile.loaded,
    properties: propertiesSelector(systemProfile)
}))(SystemCard);
