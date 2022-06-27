import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from '@react-pdf/renderer';
import { customProps, styleProps } from '../utils/propTypes';
import styles from '../utils/styles';

const appliedStyles = styles();

const PanelItem = ({ style, children, title, titleProps, ...props }) => (
  <View
    {...props}
    style={{
      flex: 1,
      ...style,
    }}
  >
    <Text
      {...titleProps}
      style={{
        ...appliedStyles.thirdTitle,
        ...appliedStyles.displayFont,
        ...titleProps.style,
      }}
    >
      {title}
    </Text>
    <View
      style={[
        appliedStyles.flexRow,
        {
          justifyContent: 'flex-start',
        },
      ]}
    >
      {typeof children === 'string' || children instanceof String ? (
        <Text
          style={{
            fontSize: 20,
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  </View>
);

PanelItem.propTypes = {
  style: styleProps,
  children: PropTypes.node,
  titleProps: customProps,
  title: PropTypes.node,
};

PanelItem.defaultProps = {
  style: {},
  titleProps: {},
  title: ' ',
};

export default PanelItem;
