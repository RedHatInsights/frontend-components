import React from 'react';
import PropTypes from 'prop-types';
import { Label } from '@patternfly/react-core';

const OperatingSystemFormatter = ({ systemProfile }) => {
    if (!systemProfile?.operating_system || !systemProfile?.operating_system?.name) {
        return <span>Not available</span>;
    }

    if (systemProfile.operating_system.name === 'RHEL') {
        const version = (systemProfile.operating_system.major && systemProfile.operating_system.minor)
        && `${systemProfile.operating_system.major}.${systemProfile.operating_system?.minor}` || null;

        return <Label color="red">
            RHEL {version}
        </Label>;
    }

    return <Label>
        {systemProfile.operating_system.name}
    </Label>;
};

OperatingSystemFormatter.propTypes = {
    systemProfile: PropTypes.shape({
        name: PropTypes.string,
        major: PropTypes.number,
        minor: PropTypes.number
    })
};

export default OperatingSystemFormatter;
