import './labels.scss';

import { AngleDoubleDownIcon } from '@patternfly/react-icons';
import { AngleDoubleUpIcon } from '@patternfly/react-icons';
import CriticalIcon from './CriticalIcon';
import { EqualsIcon } from '@patternfly/react-icons';
import { Label } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import React  from 'react';
import classNames from 'classnames';

const VALUE_TO_STATE = {
    1: { icon: <AngleDoubleDownIcon/>, text: 'Low' },
    2: { icon: <EqualsIcon/>, text: 'Moderate' },
    3: { icon: <AngleDoubleUpIcon/>, text: 'Important' },
    4: { icon: <CriticalIcon/>, text: 'Critical' }
};

const InsightsLabel = ({ value, text, hideIcon, className, rest }) => {
    return <Label
        { ...rest }
        className={ classNames(className, `ins-c-label-${value}`) }
        icon={ !hideIcon && VALUE_TO_STATE[value].icon }
    >
        { text || VALUE_TO_STATE[value].text }
    </Label>;
};

InsightsLabel.propTypes = {
    value: PropTypes.number,
    text: PropTypes.node,
    hideIcon: PropTypes.bool,
    className: PropTypes.string,
    rest: PropTypes.object
};

InsightsLabel.defaultProps = {
    value: 1
};

export default InsightsLabel;
