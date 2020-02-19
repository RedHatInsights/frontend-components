/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import {
    Canvas,
    Text,
    View
} from '@react-pdf/renderer';
// eslint-disable-next-line camelcase
import { global_icon_Color_light } from '@patternfly/react-tokens';

import styles from '../utils/styles';

const appliedStyles = styles();

const criticalSvg = 'M 99.168858,143.38516 H 351.33914 c 5.33437,0 9.69886,-5.04 9.69886,-11.2 v -28 c 0,-6.16 -4.36449,-11.2 -9.69886,-11.2 H 99.168857 c -5.334371,0 -9.698857,5.04 -9.698857,11.2 v 28 c 0,6.16 4.364486,11.2 9.698858,11.2 z M 99.168857,235.25069 H 351.33914 c 5.33437,0 9.69886,-5.04 9.69886,-11.2 v -28 c 0,-6.16 -4.36449,-11.2 -9.69886,-11.2 H 99.168857 c -5.334371,0 -9.698857,5.04 -9.698857,11.2 v 28 c 0,6.16 4.364486,11.2 9.698857,11.2 z M 99.168857,327.14542 H 351.33914 c 5.33437,0 9.69886,-5.04 9.69886,-11.19999 v -28 c 0,-6.16001 -4.36449,-11.2 -9.69886,-11.2 H 99.168857 c -5.334371,0 -9.698857,5.04 -9.698857,11.2 v 28 c 0,6.16 4.364486,11.19999 9.698857,11.19999 z M 99.168993,419.0375 H 351.33927 c 5.33437,0 9.69886,-5.04 9.69886,-11.2 v -28 c 0,-6.16 -4.36449,-11.2 -9.69886,-11.2 H 99.168993 c -5.334371,0 -9.698857,5.04 -9.698857,11.2 v 28 c 0,6.16 4.364486,11.2 9.698857,11.2 z';
const highSvg = 'M 99.168857,235.25069 H 351.33914 c 5.33437,0 9.69886,-5.04 9.69886,-11.2 v -28 c 0,-6.16 -4.36449,-11.2 -9.69886,-11.2 H 99.168857 c -5.334371,0 -9.698857,5.04 -9.698857,11.2 v 28 c 0,6.16 4.364486,11.2 9.698857,11.2 z M 99.168857,327.14542 H 351.33914 c 5.33437,0 9.69886,-5.04 9.69886,-11.19999 v -28 c 0,-6.16001 -4.36449,-11.2 -9.69886,-11.2 H 99.168857 c -5.334371,0 -9.698857,5.04 -9.698857,11.2 v 28 c 0,6.16 4.364486,11.19999 9.698857,11.19999 z M 99.168993,419.0375 H 351.33927 c 5.33437,0 9.69886,-5.04 9.69886,-11.2 v -28 c 0,-6.16 -4.36449,-11.2 -9.69886,-11.2 H 99.168993 c -5.334371,0 -9.698857,5.04 -9.698857,11.2 v 28 c 0,6.16 4.364486,11.2 9.698857,11.2 z';
const mediumSvg = 'M 99.168857,327.14542 H 351.33914 c 5.33437,0 9.69886,-5.04 9.69886,-11.19999 v -28 c 0,-6.16001 -4.36449,-11.2 -9.69886,-11.2 H 99.168857 c -5.334371,0 -9.698857,5.04 -9.698857,11.2 v 28 c 0,6.16 4.364486,11.19999 9.698857,11.19999 z M 99.168993,419.0375 H 351.33927 c 5.33437,0 9.69886,-5.04 9.69886,-11.2 v -28 c 0,-6.16 -4.36449,-11.2 -9.69886,-11.2 H 99.168993 c -5.334371,0 -9.698857,5.04 -9.698857,11.2 v 28 c 0,6.16 4.364486,11.2 9.698857,11.2 z';
const lowSvg = 'M 99.168993,419.0375 H 351.33927 c 5.33437,0 9.69886,-5.04 9.69886,-11.2 v -28 c 0,-6.16 -4.36449,-11.2 -9.69886,-11.2 H 99.168993 c -5.334371,0 -9.698857,5.04 -9.698857,11.2 v 28 c 0,6.16 4.364486,11.2 9.698857,11.2 z';
const defaultSvg = 'm 144.16452,21.032222 h 159.67454 q 123.1748,0 123.1748,128.667868 v 212.64759 q 0,128.66788 -123.1748,128.66788 H 144.16452 q -123.174811,0 -123.174811,-128.66788 V 149.70009 q 0,-128.667868 123.174811,-128.667868 z';
const batteryMapper = {
    critical: {
        svg: criticalSvg,
        color: appliedStyles.colorCrit.color,
        title: 'Crititcal'
    },
    high: {
        svg: highSvg,
        color: appliedStyles.colorHigh.color,
        title: 'High'
    },
    error: {
        svg: highSvg,
        color: appliedStyles.colorHigh.color,
        title: 'Error'
    },
    medium: {
        svg: mediumSvg,
        color: appliedStyles.colorMedium.color,
        title: 'Medium'
    },
    warn: {
        svg: mediumSvg,
        color: appliedStyles.colorMedium.color,
        title: 'Warning'
    },
    low: {
        svg: lowSvg,
        color: appliedStyles.defaultColor.color,
        title: 'Low'
    },
    info: {
        svg: lowSvg,
        color: appliedStyles.defaultColor.color,
        title: 'Info'
    }
};

const Battery = ({ variant, ...props }) => {
    const currBattery = batteryMapper[variant] || {
        svg: '',
        title: 'Unknown'
    };
    return <View {...props} style={appliedStyles.flexRow}>
        <Canvas style={{
            width: 20,
            height: 21
        }} paint={({ path, scale }) => {
            scale(0.04);
            // eslint-disable-next-line camelcase
            path(defaultSvg).lineWidth('41.9638').stroke(global_icon_Color_light.value)
            .path(currBattery.svg).fill(currBattery.color);
        } }
        />
        <Text style={{
            alignSelf: 'center',
            color: currBattery.color
        }}>
            {currBattery.title}
        </Text>
    </View>;
};

Battery.propTypes = {
    variant: PropTypes.oneOf(Object.keys(batteryMapper))
};

export default Battery;
