import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@react-pdf/renderer';
import { styleProps } from '../utils/propTypes';

const Column = ({ style, children, ...props }) => (
  <View
    {...props}
    style={{
      flex: 1,
      ...style,
    }}
  >
    {typeof children === 'string' || children instanceof String ? <Text>{children}</Text> : children}
  </View>
);

Column.propTypes = {
  style: styleProps,
  children: PropTypes.node,
};

Column.defaultProps = {
  style: {},
};

export default Column;
