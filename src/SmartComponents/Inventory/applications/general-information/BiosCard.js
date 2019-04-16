import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingCard from './LoadingCard';
import { generalMapper } from './dataMapper';
import { biosSelector } from './selectors';

const BiosCard = ({ bios, detailLoaded, handleClick }) => (<LoadingCard
    title="BIOS"
    isLoading={ !detailLoaded }
    items={ [
        { title: 'Vendor', value: bios.vendor },
        { title: 'Version', value: bios.version },
        { title: 'Release date', value: bios.releaseDate },
        {
            title: 'CSM',
            value: bios.csm ? `${bios.csm.length} CSMs` : 0,
            target: 'csm',
            onClick: () => handleClick('CSM', generalMapper(bios.csm, 'CSM name'))
        }
    ] }
/>);

BiosCard.propTypes = {
    detailLoaded: PropTypes.bool,
    handleClick: PropTypes.func,
    bios: PropTypes.shape({
        vendor: PropTypes.string,
        version: PropTypes.string,
        releaseDate: PropTypes.string,
        csm: PropTypes.arrayOf(PropTypes.string)
    })
};
BiosCard.defaultProps = {
    detailLoaded: false,
    handleClick: () => undefined
};

export default connect(({
    entityDetails: {
        systemProfile
    }
}) => ({
    detailLoaded: systemProfile && systemProfile.loaded,
    bios: biosSelector(systemProfile)
}))(BiosCard);
