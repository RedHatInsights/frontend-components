import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingCard from '../LoadingCard';
import { generalMapper } from '../dataMapper';
import { biosSelector } from '../selectors';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import { isDate } from '../constants';

const BiosCard = ({ bios, detailLoaded, handleClick }) => (<LoadingCard
    title="BIOS"
    isLoading={ !detailLoaded }
    items={ [
        { title: 'Vendor', value: bios.vendor },
        { title: 'Version', value: bios.version },
        { title: 'Release date', value: (isDate(bios.releaseDate) ?
            <DateFormat date={ new Date(bios.releaseDate) } type="onlyDate" /> :
            'Not available'
        ) },
        {
            title: 'Compatibility Support Module',
            value: bios?.csm?.length,
            plural: 'CSMs',
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
    systemProfileStore: {
        systemProfile
    }
}) => ({
    detailLoaded: systemProfile && systemProfile.loaded,
    bios: biosSelector(systemProfile)
}))(BiosCard);
