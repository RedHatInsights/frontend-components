/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@react-pdf/renderer';
import { styleProps } from '../utils/propTypes';
import styles from '../utils/styles';

const appliedStyles = styles();

const Dd = ({ style, textStyle, children }) => {
  return (
    <View
      style={{
        ...appliedStyles.dd,
        ...style,
      }}
    >
      {typeof children === 'string' ? (
        <Text
          style={{
            ...appliedStyles.text,
            ...textStyle,
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};

Dd.propTypes = {
  style: styleProps,
  textStyle: styleProps,
  children: PropTypes.node,
  rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node)),
};

Dd.defaultProps = {
  style: {},
  textStyle: {},
};

export default Dd;
