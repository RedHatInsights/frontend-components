import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingCard from './LoadingCard';
import { generalMapper } from './dataMapper';
import { operatingSystem } from './selectors';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import { isDate } from './constants';

const OperatingSystemCard = ({ systemInfo, detailLoaded, handleClick }) => (
    <LoadingCard
        title="Operating system"
        isLoading={ !detailLoaded }
        items={ [
            { title: 'Release', value: systemInfo.release },
            { title: 'Kernel release', value: systemInfo.kernelRelease },
            { title: 'Architecture', value: systemInfo.architecture },
            { title: 'Last boot time', value: (isDate(systemInfo.bootTime) ?
                <DateFormat date={ systemInfo.bootTime } type="onlyDate" /> :
                'Not available'
            )
            },
            {
                title: 'Kernel modules',
                value: systemInfo.kernelModules ? `${systemInfo.kernelModules.length} modules` : 0,
                target: 'kernel_modules',
                onClick: () => {
                    handleClick(
                        'Kernel modules',
                        generalMapper(systemInfo.kernelModules, 'Module')
                    );
                }
            }
        ] }
    />
);

OperatingSystemCard.propTypes = {
    detailLoaded: PropTypes.bool,
    handleClick: PropTypes.func,
    systemInfo: PropTypes.shape({
        release: PropTypes.string,
        architecture: PropTypes.string,
        kernelRelease: PropTypes.string,
        bootTime: PropTypes.string,
        kernelModules: PropTypes.arrayOf(PropTypes.string)
    })
};
OperatingSystemCard.defaultProps = {
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
    systemInfo: operatingSystem(systemProfile, entity)
}))(OperatingSystemCard);
