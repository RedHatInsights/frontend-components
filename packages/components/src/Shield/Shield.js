import { Tooltip } from '@patternfly/react-core';
import { QuestionIcon, SecurityIcon } from '@patternfly/react-icons';
import propTypes from 'prop-types';
import React from 'react';
import { impactList } from './consts';

const Shield = ({ impact, hasLabel, hasTooltip, size }) => {
    const attributes = impactList?.[impact] ?? impactList.Unknown;
    const badgeProps = {
        'aria-hidden': 'false',
        'aria-label': attributes.title,
        color: attributes.color,
        size
    };

    const badge = attributes.title === 'Unknown'
        ? <QuestionIcon {...badgeProps} />
        : <SecurityIcon {...badgeProps} />;

    const body = (
        <span>
            {badge} {hasLabel && attributes.title}
        </span>
    );

    return (
        <span>
            {hasTooltip ?
                <Tooltip content={<div>{attributes.message}</div>} position={'bottom'}>
                    {body}
                </Tooltip>
                : body}
        </span>
    );
};

Shield.defaultProps = {
    impact: 'N/A',
    hasLabel: false,
    size: 'sm',
    hasTooltip: true
};

Shield.propTypes = {
    impact: propTypes.oneOfType([ propTypes.string, propTypes.number ]),
    hasLabel: propTypes.bool,
    size: propTypes.string, // sm, md, lg and xl,
    label: propTypes.bool,
    hasTooltip: propTypes.bool
};

export default Shield;
