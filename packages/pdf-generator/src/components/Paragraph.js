import { Text, View } from '@react-pdf/renderer';
import { customProps, styleProps } from '../utils/propTypes';

import PropTypes from 'prop-types';
import React from 'react';
import { customTitle } from '../utils/text';
import styles from '../utils/styles';

const appliedStyles = styles();

const Paragraph = ({ style, children, paragraphProps, ...props }) => (
  <View
    {...props}
    style={{
      ...style,
    }}
  >
    <Text
      {...paragraphProps}
      style={{
        ...appliedStyles.displayFont,
      }}
    >
      {customTitle(children)}
    </Text>
  </View>
);

Paragraph.propTypes = {
  style: styleProps,
  children: PropTypes.node,
  paragraphProps: customProps,
};

Paragraph.defaultProps = {
  style: {},
  paragraphProps: {},
};

export default Paragraph;
