import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@react-pdf/renderer';
import { styleProps, customProps } from '../utils/propTypes';
import { customTitle } from '../utils/text';
import styles from '../utils/styles';

const appliedStyles = styles();

const Panel = ({
    style,
    title,
    titleProps,
    contentProps,
    children,
    description,
    ...props
}) => (<View
    {...props}
    style={{
        ...style
    }}
>
    <Text { ...titleProps } style={[
        appliedStyles.secondTitle,
        appliedStyles.smallSpacing,
        ...titleProps.style || []
    ]}>
        {title}
    </Text>
    <View {...contentProps} style={{
        ...appliedStyles.flexRow,
        ...contentProps.style
    }}>
        {children}
        <Text style={{
            flex: 3
        }}>
            {customTitle(description)}
        </Text>
    </View>
</View>);

Panel.propTypes = {
    style: styleProps,
    title: PropTypes.string,
    titleProps: customProps,
    contentProps: customProps,
    children: PropTypes.node,
    description: PropTypes.string
};

Panel.defaultProps = {
    style: {},
    titleProps: {},
    contentProps: {}
};

export default Panel;
