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
    labels,
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
        <View style= {{ flex: 4 }}>
            <View style={[ appliedStyles.panelLabels ]}>
                { labels }
            </View>
            <Text>
                {customTitle(description)}
            </Text>
        </View>
    </View>
</View>);

Panel.propTypes = {
    style: styleProps,
    title: PropTypes.string,
    titleProps: customProps,
    contentProps: customProps,
    children: PropTypes.node,
    description: PropTypes.string,
    labels: PropTypes.node
};

Panel.defaultProps = {
    style: {},
    titleProps: {},
    contentProps: {}
};

export default Panel;
