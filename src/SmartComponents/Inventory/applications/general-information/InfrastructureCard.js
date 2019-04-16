import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingCard from './LoadingCard';
import { generalMapper, interfaceMapper } from './dataMapper';
import { infrastructureSelector } from './selectors';

const InfrastructureCard = ({ infrastructure, handleClick, detailLoaded }) => (<LoadingCard
    title="Infrastructure"
    isLoading={ !detailLoaded }
    items={ [
        { title: 'Type', value: infrastructure.type },
        { title: 'Vendor', value: infrastructure.vendor },
        {
            title: 'IPv4 addresses',
            value: infrastructure.ipv4 ? `${infrastructure.ipv4.length} addresses` : 0,
            target: 'ipv4',
            onClick: () => {
                handleClick(
                    'IPv4',
                    generalMapper(infrastructure.ipv4, 'IP address')
                );
            }
        },
        {
            title: 'IPv6 addresses',
            value: infrastructure.ipv6 ? `${infrastructure.ipv6.length} addresses` : 0,
            target: 'ipv6',
            onClick: () => {
                handleClick(
                    'IPv6',
                    generalMapper(infrastructure.ipv6, 'IP address')
                );
            }
        },
        {
            title: 'Interfaces/NICs',
            value: infrastructure.nics ? `${infrastructure.nics.length} NICs` : 0,
            target: 'interfaces',
            onClick: () => {
                handleClick(
                    'Interfaces/NICs',
                    interfaceMapper(infrastructure.nics)
                );
            }
        }
    ] }
/>);

InfrastructureCard.propTypes = {
    detailLoaded: PropTypes.bool,
    handleClick: PropTypes.func,
    infrastructure: PropTypes.shape({
        type: PropTypes.string,
        vendor: PropTypes.string,
        ipv4: PropTypes.array,
        ipv6: PropTypes.array,
        nics: PropTypes.array
    })
};
InfrastructureCard.defaultProps = {
    detailLoaded: false,
    handleClick: () => undefined
};

export default connect(({
    entityDetails: {
        systemProfile
    }
}) => ({
    detailLoaded: systemProfile && systemProfile.loaded,
    infrastructure: infrastructureSelector(systemProfile)
}))(InfrastructureCard);
