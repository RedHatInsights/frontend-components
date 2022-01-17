import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import { styleProps } from '../utils/propTypes';
import styles from '../utils/styles';

const appliedStyles = styles();

const Section = ({ title, titleProps, contentStyle, style, children, withColumn, ...props }) => (
  <View
    style={{
      ...appliedStyles.smallSpacing,
      ...style,
    }}
    {...props}
  >
    <Text
      {...titleProps}
      style={{
        ...appliedStyles.firstTitle,
        ...appliedStyles.smallSpacing,
        ...(titleProps && titleProps.style),
      }}
    >
      {title}
    </Text>
    <View
      style={{
        ...(withColumn && appliedStyles.flexRow),
        ...appliedStyles.section,
        ...contentStyle,
      }}
    >
      {children}
    </View>
  </View>
);

Section.propTypes = {
  title: PropTypes.string,
  titleProps: PropTypes.shape({
    style: styleProps,
  }),
  style: styleProps,
  contentStyle: styleProps,
  children: PropTypes.node,
  withColumn: PropTypes.bool,
};

Section.defaultProps = {
  withColumn: true,
  title: '',
  titleProps: {},
  style: {},
  contentStyle: {},
};

export default Section;
