/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from '@react-pdf/renderer';
import global_BorderColor_300 from '@patternfly/react-tokens/dist/js/global_BorderColor_300';
import global_BorderColor_200 from '@patternfly/react-tokens/dist/js/global_BorderColor_200';
import { styleProps } from '../utils/propTypes';
import styles from '../utils/styles';

const appliedStyles = styles();

const Table = ({ rows, withHeader, headerStyles, rowsStyle, style, ...props }) => {
  const [header, ...cells] = rows;
  return (
    <View
      {...props}
      style={{
        ...appliedStyles.flexColum,
        ...style,
      }}
    >
      {withHeader && (
        <View
          style={{
            ...appliedStyles.flexRow,
            ...appliedStyles.compactCellPadding,
            ...headerStyles,
          }}
        >
          {header.map((cell, key) =>
            typeof cell === 'string' || cell instanceof String ? (
              <Text
                key={key}
                style={{
                  ...appliedStyles.secondTitle,
                  ...appliedStyles.compactCellPadding,
                  flex: 1,
                }}
              >
                {cell}
              </Text>
            ) : (
              cell
            )
          )}
        </View>
      )}
      <View
        style={{
          borderTopStyle: 'solid',
          borderTopColor: global_BorderColor_200.value,
          borderTopWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: global_BorderColor_200.value,
          borderBottomWidth: 1,
        }}
      >
        {(!withHeader ? [header, ...cells] : cells).map((row, key) => (
          <View
            key={key}
            style={{
              ...appliedStyles.flexRow,
              ...appliedStyles.compactCellPadding,
              ...(key % 2 && { backgroundColor: global_BorderColor_300.value }),
              ...rowsStyle,
            }}
          >
            {row.map((cell, cellKey) =>
              typeof cell === 'string' || cell instanceof String ? (
                <Text
                  key={cellKey}
                  style={{
                    ...appliedStyles.text,
                    ...appliedStyles.compactCellPadding,
                    flex: 1,
                  }}
                >
                  {cell}
                </Text>
              ) : (
                cell
              )
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

Table.propTypes = {
  style: styleProps,
  rowsStyle: styleProps,
  withHeader: PropTypes.bool,
  rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node)),
  headerStyles: styleProps,
};

Table.defaultProps = {
  style: {},
  headerStyles: {},
  rowsStyle: {},
};

export default Table;
