/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { View } from '@react-pdf/renderer';
import { styleProps } from '../utils/propTypes';
import styles from '../utils/styles';

const appliedStyles = styles();

const Dl = ({ style, children }) => {
  return (
    <View
      style={{
        ...appliedStyles.dl,
        ...style,
      }}
    >
      {children}
    </View>
  );
};

Dl.propTypes = {
  style: styleProps,
  children: PropTypes.node,
  rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node)),
};

Dl.defaultProps = {
  style: {},
};

export default Dl;
