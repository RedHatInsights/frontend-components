import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingCard from '../LoadingCard';
import { generalMapper, interfaceMapper } from '../dataMapper';
import { infrastructureSelector } from '../selectors';

const InfrastructureCard = ({ infrastructure, handleClick, detailLoaded }) => (<LoadingCard
    title="Infrastructure"
    isLoading={ !detailLoaded }
    items={ [
        { title: 'Type', value: infrastructure.type },
        { title: 'Vendor', value: infrastructure.vendor },
        {
            title: 'IPv4 addresses',
            value: infrastructure.ipv4?.length,
            plural: 'addresses',
            singular: 'address',
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
            value: infrastructure.ipv6?.length,
            plural: 'addresses',
            singular: 'address',
            onClick: () => {
                handleClick(
                    'IPv6',
                    generalMapper(infrastructure.ipv6, 'IP address')
                );
            }
        },
        {
            title: 'Interfaces/NICs',
            value: infrastructure.nics?.length,
            singular: 'NIC',
            target: 'interfaces',
            onClick: () => {
                handleClick(
                    'Interfaces/NICs',
                    interfaceMapper(infrastructure.nics),
                    'medium'
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
        entity
    },
    systemProfileStore: {
        systemProfile
    }
}) => ({
    detailLoaded: systemProfile && systemProfile.loaded,
    infrastructure: infrastructureSelector(systemProfile, entity)
}))(InfrastructureCard);
