import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingCard from '../LoadingCard';
import { generalMapper, interfaceMapper } from '../dataMapper';
import { infrastructureSelector } from '../selectors';
import { extraShape } from '../constants';

const InfrastructureCard = ({
    infrastructure,
    handleClick,
    detailLoaded,
    hasType,
    hasVendor,
    hasIPv4,
    hasIPv6,
    hasInterfaces,
    extra
}) => (<LoadingCard
    title="Infrastructure"
    isLoading={ !detailLoaded }
    items={ [
        ...hasType ? [{ title: 'Type', value: infrastructure.type }] : [],
        ...hasVendor ? [{ title: 'Vendor', value: infrastructure.vendor }] : [],
        ...hasIPv4 ? [{
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
        }] : [],
        ...hasIPv6 ? [{
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
        }] : [],
        ...hasInterfaces ? [{
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
        }] : [],
        ...extra.map(({ onClick, ...item }) => ({
            ...item,
            ...onClick && { onClick: (e) => onClick(e, handleClick) }
        }))
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
    }),
    hasType: PropTypes.bool,
    hasVendor: PropTypes.bool,
    hasIPv4: PropTypes.bool,
    hasIPv6: PropTypes.bool,
    hasInterfaces: PropTypes.bool,
    extra: PropTypes.arrayOf(extraShape)
};
InfrastructureCard.defaultProps = {
    detailLoaded: false,
    handleClick: () => undefined,
    hasType: true,
    hasVendor: true,
    hasIPv4: true,
    hasIPv6: true,
    hasInterfaces: true,
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
    detailLoaded: systemProfile && systemProfile.loaded,
    infrastructure: infrastructureSelector(systemProfile, entity)
}))(InfrastructureCard);
