/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';

import { View, Rect, Text, Svg, G, Path } from '@react-pdf/renderer';
import styles from '../utils/styles';

const appliedStyles = styles();

const lowPath = 'M143 256.3L7 120.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0L313 86.3c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.4 9.5-24.6 9.5-34 .1zm34 192l136-136c9.4-9.4 9.4-24.6 0-33.9l-22.6-22.6c-9.4-9.4-24.6-9.4-33.9 0L160 352.1l-96.4-96.4c-9.4-9.4-24.6-9.4-33.9 0L7 278.3c-9.4 9.4-9.4 24.6 0 33.9l136 136c9.4 9.5 24.6 9.5 34 .1z';
const moderatePath = 'M416 304H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32zm0-192H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z';
const importantPath = 'M177 255.7l136 136c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0L160 351.9l-96.4 96.4c-9.4 9.4-24.6 9.4-33.9 0L7 425.7c-9.4-9.4-9.4-24.6 0-33.9l136-136c9.4-9.5 24.6-9.5 34-.1zm-34-192L7 199.7c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l96.4-96.4 96.4 96.4c9.4 9.4 24.6 9.4 33.9 0l22.6-22.6c9.4-9.4 9.4-24.6 0-33.9l-136-136c-9.2-9.4-24.4-9.4-33.8 0z';
const criticalPath = 'M0 84l189-84L378 84L378 441l-189-84L0 441z';

const labelMapper = {
    1: {
        text: 'Low',
        iconPath: lowPath,
        width: 40,
        ...appliedStyles.labelColorsLow
    },
    2: {
        text: 'Moderate',
        iconPath: moderatePath,
        width: 65,
        ...appliedStyles.labelColorsModerate
    },
    3: {
        text: 'Important',
        iconPath: importantPath,
        width: 63,
        ...appliedStyles.labelColorsImportant
    },
    4: {
        text: 'Critical',
        iconPath: criticalPath,
        width: 55,
        ...appliedStyles.labelColorsCrit
    }
};

const InsightsLabel = ({ variant, label, icon, labelStyle, iconStyle, textStyle, bgStyle, ...props }) => {
    let { bgColor, iconColor, iconPath, width, text, textColor } = labelMapper[variant];

    width = props.width ?? width;

    return <View style={appliedStyles.flexRow} {...props}>
        <Svg width={width + 10} height="20" {...labelStyle}>
            <Rect width="100%" height="100%" fill={bgColor} rx="10" ry="10" {...bgStyle} />
            {icon &&
                    <G transform="translate(10,5)">
                        <Path transform="scale(0.02)" d={iconPath} fill={iconColor} {...iconStyle}/>
                        <Text fill={textColor} fontSize={10} x={10} y={8} {...textStyle}>
                            { label ? label : text}
                        </Text>
                    </G>
            }
        </Svg>
    </View>;
};

InsightsLabel.propTypes = {
    variant: PropTypes.number,
    label: PropTypes.string,
    icon: PropTypes.bool,
    width: PropTypes.number,
    labelStyle: PropTypes.object,
    iconStyle: PropTypes.object,
    textStyle: PropTypes.object,
    bgStyle: PropTypes.object
};

InsightsLabel.defaultProps = {
    variant: 1,
    icon: true
};

export default InsightsLabel;
