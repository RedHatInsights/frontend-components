import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingCard from './LoadingCard';
import { generalMapper } from './dataMapper';
import { operatingSystem } from './selectors';

const OperatingSystemCard = ({ systemInfo, detailLoaded, handleClick }) => (
    <LoadingCard
        title="Operating System"
        isLoading={ !detailLoaded }
        items={ [
            { title: 'Release', value: systemInfo.release },
            { title: 'Kernel release', value: systemInfo.kernelRelease },
            { title: 'Architecture', value: systemInfo.architecture },
            { title: 'Last boot time', value: new Date(systemInfo.bootTime).toLocaleString() },
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
    systemProfileStore: {
        systemProfile
    }
}) => ({
    detailLoaded: systemProfile && systemProfile.loaded,
    systemInfo: operatingSystem(systemProfile)
}))(OperatingSystemCard);
