import React from 'react';
import PropTypes from 'prop-types';

const OperatingSystemFormatter = ({ systemProfile }) => {
    if (systemProfile?.operating_system?.name === 'RHEL') {
        const version = (systemProfile.operating_system.major && systemProfile.operating_system.minor)
        && `${systemProfile.operating_system.major}.${systemProfile.operating_system?.minor}` || null;

        return <span>
            RHEL {version}
        </span>;
    }

    return <span>
        {systemProfile?.operating_system?.name || 'Not available'}
    </span>;
};

OperatingSystemFormatter.propTypes = {
    systemProfile: PropTypes.shape({
        name: PropTypes.string,
        major: PropTypes.number,
        minor: PropTypes.number,
        // eslint-disable-next-line camelcase
        operating_system: PropTypes.shape({ name: PropTypes.string, major: PropTypes.number, minor: PropTypes.number })
    })
};

export default OperatingSystemFormatter;
